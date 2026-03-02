# FarPass — Архитектура

## Как устроен сервис

FarPass состоит из трёх частей: **фронтенд** (React SPA), **бэкенд** (Go API-сервер) и **хранилище** (Memcached или Redis). Весь процесс шифрования происходит в браузере — сервер работает только как «глупый сейф», который хранит зашифрованные конверты и отдаёт их по запросу.

---

## Общая архитектура

```mermaid
graph TB
    subgraph "👤 Пользователи"
        A["Отправитель<br/>(браузер)"]
        B["Получатель<br/>(браузер)"]
    end

    subgraph "🐳 Docker"
        subgraph "farpass-server · Go · :80"
            SPA["Статика SPA<br/>React + Vite"]
            API["REST API<br/>POST/GET /secret<br/>POST/GET /file"]
        end
    end

    subgraph "💾 Хранилище"
        MC["Memcached :11211<br/>(по умолчанию)"]
        RD["Redis :6379<br/>(опционально)"]
    end

    PROM["📊 Prometheus<br/>/metrics"]

    A -- "шифротекст" --> API
    B -- "запрос по UUID" --> API
    API --> MC
    API -.-> RD
    API -.-> PROM
    A -- "загрузка страницы" --> SPA
    B -- "загрузка страницы" --> SPA
```

---

## Как отправляется секрет

```mermaid
sequenceDiagram
    participant U as Отправитель
    participant BR as Браузер (JS)
    participant SRV as farpass-server
    participant DB as Memcached/Redis

    U->>BR: Вводит секретный текст
    BR->>BR: Генерирует случайный ключ
    BR->>BR: Шифрует PGP (AES-256)
    BR->>SRV: POST /secret {шифротекст, TTL}
    SRV->>DB: Сохраняет UUID → шифротекст
    SRV-->>BR: Ответ: {UUID}
    BR->>BR: Формирует ссылку /s/{UUID}/{ключ}
    Note over BR: Ключ — только в #fragment,<br/>он НЕ отправляется на сервер
    BR-->>U: Показывает готовую ссылку
```

---

## Как получается секрет

```mermaid
sequenceDiagram
    participant U as Получатель
    participant BR as Браузер (JS)
    participant SRV as farpass-server
    participant DB as Memcached/Redis

    U->>BR: Открывает ссылку
    BR->>SRV: Загрузка SPA (index.html)
    SRV-->>BR: React-приложение
    BR->>BR: Извлекает UUID из пути
    BR->>SRV: GET /secret/{UUID}
    SRV->>DB: Читает шифротекст
    SRV->>DB: Удаляет запись (если one_time)
    SRV-->>BR: {шифротекст}
    BR->>BR: Извлекает ключ из #fragment
    BR->>BR: Расшифровывает PGP
    BR-->>U: Показывает открытый текст
```

---

## Компоненты и стек

| Слой | Технология | Для чего |
|------|-----------|----------|
| **Фронтенд** | React 18 + TypeScript + Vite + Tailwind | SPA, шифрование в браузере через OpenPGP.js |
| **Бэкенд** | Go 1.24, Gorilla Mux | REST API, раздача статики, валидация PGP |
| **Хранилище** | Memcached (default) / Redis | Хранение шифротекста с TTL |
| **Шифрование** | OpenPGP.js (браузер), golang.org/x/crypto (CLI) | AES-256, PGP-формат |
| **Контейнер** | Docker multi-stage → distroless | Минимальный образ ~50 МБ |
| **Деплой** | Docker Compose / Kubernetes | Одна команда для запуска |
| **Мониторинг** | Prometheus (опционально) | HTTP-метрики, Go-рантайм |

---

## REST API

| Метод | Эндпоинт | Что делает |
|-------|----------|-----------|
| `POST` | `/secret` | Сохранить зашифрованный секрет |
| `GET` | `/secret/{key}` | Получить секрет (удаляет если одноразовый) |
| `GET` | `/secret/{key}/meta` | Метаинфо: одноразовый ли секрет |
| `POST` | `/file` | Сохранить зашифрованный файл |
| `GET` | `/file/{key}` | Получить файл |

---

## Инфраструктура (Docker Compose)

```mermaid
graph LR
    subgraph "Сеть"
        USER["🌐 Браузер"]
    end

    subgraph "Reverse Proxy (опц.)"
        NGINX["nginx :443"]
    end

    subgraph "Docker Compose"
        FP["farpass-server :80"]
        MEM["memcached :11211<br/>64 МБ RAM"]
    end

    USER -->|HTTPS| NGINX
    NGINX -->|HTTP| FP
    FP --> MEM
```

---

## Структура проекта

| Путь | Что внутри |
|------|-----------|
| `cmd/farpass/` | CLI-клиент — шифрует/дешифрует из терминала |
| `cmd/farpass-server/` | Точка входа API-сервера |
| `pkg/farpass/` | Ядро: `Encrypt()`, `Decrypt()`, HTTP-клиент |
| `pkg/server/` | Роуты, хэндлеры, интерфейс `Database`, реализации Memcached и Redis |
| `website/src/features/` | Страницы: создание секрета, загрузка файла, расшифровка |
| `website/src/shared/lib/` | `crypto.ts` (OpenPGP.js), `api.ts` (fetch к бэкенду) |
| `website/src/shared/locales/` | Переводы (i18n) |
| `website/tests/` | E2E-тесты (Playwright) |
| `deploy/` | Docker Compose (insecure / с TLS), Kubernetes-манифест |
| `Dockerfile` | Multi-stage: Go → Bun → distroless |

---

## Принцип безопасности

| На сервере **есть** | На сервере **нет** |
|---------------------|-------------------|
| Зашифрованный текст (PGP) | Открытый текст секрета |
| UUID ссылки | Ключ расшифровки |
| TTL (время жизни) | Информация об отправителе |
| Флаг одноразовости | Информация о получателе |
| | Логи содержимого |

> Ключ расшифровки находится **только** в URL-фрагменте (`#`), который браузер **не отправляет** на сервер — это стандарт HTTP.

---

<p align="center"><b>FarPass</b> · FARTECH · Farpost</p>
