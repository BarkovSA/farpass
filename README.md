![FarPass](logo/farpass-horizontal.svg)

# FarPass — безопасная передача секретов 🔐

[![Go Report Card](https://goreportcard.com/badge/github.com/BarkovSA/farpass)](https://goreportcard.com/report/github.com/BarkovSA/farpass)
[![codecov](https://codecov.io/gh/BarkovSA/farpass/branch/master/graph/badge.svg)](https://codecov.io/gh/BarkovSA/farpass)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/BarkovSA/farpass?sort=semver)

Вставил секрет → получил одноразовую ссылку → отправил коллеге. Ссылка самоуничтожается после первого открытия. Шифрование происходит **прямо в браузере** — сервер никогда не видит открытый текст.

## ✨ Возможности

| | |
|---|---|
| 🔒 **End-to-End шифрование** | PGP/AES-256 в браузере, сервер хранит только шифротекст |
| 💥 **Одноразовые ссылки** | Секрет удаляется после первого открытия |
| ⏱️ **Автоудаление** | 1 час / 1 день / 1 неделя — на выбор |
| 📎 **Файлы** | Можно передать и текст, и файл |
| 🔑 **Свой пароль** | Дополнительный слой защиты |
| 👤 **Без регистрации** | Просто открыл и отправил |
| 🖥️ **CLI** | Для автоматизации из терминала |

## 🚀 Быстрый старт

```bash
git clone https://github.com/BarkovSA/farpass.git
cd farpass/deploy/docker-compose/insecure
docker compose up -d --build
```

Открывайте **http://localhost** — готово! 🎉

Для продакшена с TLS используйте `deploy/docker-compose/with-nginx-proxy-and-letsencrypt`.

## 🖥️ CLI

Установка (нужен Go ≥ 1.21):

```bash
go install github.com/BarkovSA/farpass/cmd/farpass@latest
```

```bash
# Отправить секрет
echo "пароль" | farpass --api https://farpass.company.ru

# Отправить файл
farpass --file /path/to/secret.key

# Получить секрет
farpass --decrypt "https://farpass.company.ru/#/s/abc123/key"
```

Настройки по умолчанию — в `~/.config/farpass/defaults.yaml`:

```yaml
api: https://farpass.company.ru
expiration: 1d
one-time: true
```

## ⚙️ Настройка сервера

Ключевые флаги `farpass-server`:

| Флаг | По умолчанию | Описание |
|------|-------------|----------|
| `--port` | `1337` | Порт сервера |
| `--database` | `memcached` | Хранилище: `memcached` или `redis` |
| `--force-onetime-secrets` | — | Только одноразовые ссылки |
| `--disable-upload` | — | Отключить загрузку файлов |
| `--metrics-port` | — | Порт Prometheus-метрик |
| `--trusted-proxies` | — | IP/CIDR доверенных прокси |
| `--tls-cert / --tls-key` | — | Пути к TLS-сертификату |

### 🐳 Docker Compose (с TLS)

Направьте DNS домена на сервер, заполните `VIRTUAL_HOST`, `LETSENCRYPT_HOST`, `LETSENCRYPT_EMAIL` в `deploy/docker-compose/with-nginx-proxy-and-letsencrypt/docker-compose.yml` и запустите:

```bash
docker compose up -d
```

### ☸️ Kubernetes

```bash
kubectl apply -f deploy/farpass-k8.yaml
kubectl port-forward service/farpass 1337:1337
```

## 📊 Мониторинг

Добавьте флаг `--metrics-port 9090` — Prometheus-метрики будут доступны на `/metrics`.

## 🌍 Переводы

Поддерживается интернационализация (react-i18next). Переводы принимаются через pull request — см. [пример добавления языка](https://github.com/BarkovSA/farpass/pull/3024).
