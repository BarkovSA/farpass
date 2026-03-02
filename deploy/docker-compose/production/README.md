# Production Deploy — FarPass на splitmind.ru

## Требования

- VPS/сервер с Linux (Ubuntu 22+, Debian 12+ и т.п.)
- Docker Engine 24+ и Docker Compose v2
- Домен `splitmind.ru` с A-записью, указывающей на IP сервера
- Открытые порты: **80** (HTTP) и **443** (HTTPS)

## Быстрый старт

```bash
# 1. Клонируем репо
git clone https://github.com/BarkovSA/farpass.git
cd farpass/deploy/docker-compose/production

# 2. Создаём .env файл
cp .env.example .env
# Отредактируйте .env если нужно изменить домен/email

# 3. Запускаем
docker compose up -d --build

# 4. Проверяем
curl https://splitmind.ru/health
```

Caddy автоматически получит TLS-сертификат от Let's Encrypt при первом запросе.

## Что происходит

```
Интернет → :80/:443 → Caddy (auto-TLS, HTTP/3)
                         ↓ reverse_proxy
                       FarPass (:1337) — Go-бэкенд + SPA
                         ↓
                       Memcached (:11211) — хранилище секретов
```

## DNS-настройка

В панели управления доменом `splitmind.ru` создайте:

| Тип  | Хост | Значение         | TTL  |
|------|------|------------------|------|
| A    | @    | `<IP сервера>`   | 300  |
| A    | www  | `<IP сервера>`   | 300  |

## Команды

```bash
# Логи
docker compose logs -f

# Перезапуск
docker compose restart

# Обновление
git pull
docker compose up -d --build

# Остановка
docker compose down
```

## Переключение на Redis (опционально)

Если нужна персистентность — замените memcached на Redis в `docker-compose.yml`:

```yaml
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    expose:
      - "6379"
    volumes:
      - redis_data:/data
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
```

И в команде farpass: `--redis=redis://redis:6379/0`
