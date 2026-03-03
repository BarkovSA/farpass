![FarPass](../logo/farpass-horizontal.svg)

# FarPass — Инструкция 📖

## 🔐 Отправить секрет

1. Откройте FarPass в браузере
2. Вставьте секрет, выберите срок жизни (час / день / неделя)
3. При желании задайте свой пароль 🔑
4. Нажмите **«Создать ссылку»** и отправьте её получателю

> 💡 **Совет:** ссылку отправляйте в одном канале, контекст (зачем пароль) — в другом.

## 📎 Отправить файл

Переключитесь на вкладку файлов → выберите файл → нажмите **«Создать ссылку»**.

## 📬 Получить секрет

Откройте ссылку → введите пароль (если нужен) → скопируйте секрет.
Ссылка одноразовая — после открытия больше не работает 💥

---

## 🖥️ CLI

Установка (нужен Go ≥ 1.21):

```bash
go install github.com/BarkovSA/farpass/cmd/farpass@latest
```

```bash
# Отправить текст
echo "пароль" | farpass --api https://farpass.company.ru

# Отправить файл
farpass --file /path/to/secret.key

# Получить секрет
farpass --decrypt "https://farpass.company.ru/#/s/abc123/key456"
```

Настройки по умолчанию — `~/.config/farpass/defaults.yaml`:

```yaml
api: https://farpass.company.ru
expiration: 1d
one-time: true
```

---

## ⚙️ Для администраторов

### 🐳 Запуск (без TLS)

```bash
git clone https://github.com/BarkovSA/farpass.git
cd farpass/deploy/docker-compose/insecure
docker compose up -d --build
```

Сервис на `http://localhost:80` 🎉

### 🔒 С TLS (Let's Encrypt)

Направьте DNS на сервер, замените `VIRTUAL_HOST`, `LETSENCRYPT_HOST`, `LETSENCRYPT_EMAIL` в `deploy/docker-compose/with-nginx-proxy-and-letsencrypt/docker-compose.yml`:

```bash
cd deploy/docker-compose/with-nginx-proxy-and-letsencrypt
docker compose up -d
```

### ☸️ Kubernetes

```bash
kubectl apply -f deploy/farpass-k8.yaml
kubectl port-forward service/farpass 1337:1337
```

### 🎛️ Полезные флаги

| Флаг | Что делает |
|------|-----------|
| `--force-onetime-secrets` | Только одноразовые ссылки ✅ |
| `--disable-upload` | Отключить загрузку файлов |
| `--max-length 50000` | Увеличить лимит сообщения |
| `--database redis` | Redis вместо Memcached |
| `--metrics-port 9090` | Prometheus-метрики 📊 |
| `--trusted-proxies 10.0.0.0/8` | За reverse proxy — обязательно |

### 🔧 Обслуживание

```bash
docker compose pull && docker compose up -d  # обновление
docker compose logs -f farpass               # логи
```

Бэкап не нужен — секреты временные и зашифрованные, это задумано так 🙂

---

## ❓ FAQ

**Сервер упал — секреты пропали?**
При Memcached — да, всё в RAM. Redis переживёт перезапуск. Но секреты и так временные — это нормально.

**Может ли администратор сервера прочитать секреты?**
Нет 🚫 Шифрование в браузере, ключ в `#`-фрагменте URL — сервер его не получает.

**Безопасно через HTTP?**
Только внутри доверенной сети. Через интернет — только HTTPS 🔒

**Как понять, что секрет уже прочитан?**
Ссылка перестанет работать — откроется страница «Секрет не найден».
