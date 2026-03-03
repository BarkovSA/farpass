![FarPass](../logo/farpass-horizontal.svg)

# FarPass — Инструкция

---

## Отправить секрет

Откройте FarPass в браузере, вставьте секрет в поле ввода и нажмите **«Создать секретную ссылку»**. Перед отправкой можно выбрать **срок жизни** (час, день, неделя) и задать **свой пароль** для дополнительной защиты. Готовую ссылку отправьте получателю.

> Хорошая практика — отправлять ссылку и контекст (для чего пароль) **разными каналами**: ссылку в Slack, а пояснение — в тикете.

## Отправить файл

Переключитесь на вкладку загрузки файлов, выберите файл, настройте параметры и нажмите **«Создать ссылку»**.

## Получить секрет

Откройте ссылку в браузере → введите пароль (если требуется) → скопируйте секрет. **Ссылка одноразовая** — при повторном открытии покажет ошибку.

---

## CLI (командная строка)

Установка (нужен Go ≥ 1.21):

```bash
go install github.com/BarkovSA/farpass/cmd/farpass@latest
```

Отправить:

```bash
echo "пароль" | farpass --api https://farpass.company.ru
farpass --file /path/to/secret.key --api https://farpass.company.ru
```

Получить:

```bash
farpass --decrypt "https://farpass.company.ru/#/s/abc123/key456"
```

Чтобы не указывать `--api` каждый раз — создайте `~/.config/farpass/defaults.yaml`:

```yaml
api: https://farpass.company.ru
url: https://farpass.company.ru
expiration: 1d
one-time: true
```

---

## Для администраторов

### Запуск (самый простой способ)

```bash
git clone https://github.com/BarkovSA/farpass.git
cd farpass/deploy/docker-compose/insecure
docker compose up -d --build
```

Сервис доступен на `http://localhost:80`.

### Запуск с TLS (Let's Encrypt)

Направьте DNS домена на сервер, отредактируйте `deploy/docker-compose/with-nginx-proxy-and-letsencrypt/docker-compose.yml` — замените `VIRTUAL_HOST`, `LETSENCRYPT_HOST` и `LETSENCRYPT_EMAIL` на свои значения, затем:

```bash
cd deploy/docker-compose/with-nginx-proxy-and-letsencrypt
docker compose up -d
```

### Kubernetes

```bash
kubectl apply -f deploy/farpass-k8.yaml
kubectl port-forward service/farpass 1337:1337
```

### Рекомендуемые опции

| Опция | Что делает |
|-------|-----------|
| `--force-onetime-secrets` | Только одноразовые ссылки (рекомендуется) |
| `--disable-upload` | Отключить загрузку файлов |
| `--max-length 50000` | Увеличить лимит сообщения |
| `--database redis` | Redis вместо Memcached (для персистентности) |
| `--metrics-port 9090` | Prometheus-метрики |
| `--trusted-proxies 10.0.0.0/8` | Обязательно за reverse proxy |

### Обслуживание

- **Бэкап не нужен** — секреты временные и зашифрованные, это by design
- **Обновление** — `docker compose pull && docker compose up -d`
- **Логи** — `docker compose logs -f farpass`

---

## FAQ

**Сервер упал — секреты потерялись?**
Да, при Memcached всё в RAM. С Redis данные переживут перезапуск. Но секреты и так временные — это нормально.

**Может ли админ сервера прочитать секреты?**
Нет. Шифрование в браузере, ключ в URL-фрагменте (`#`) — сервер его не получает.

**Безопасно через HTTP?**
Только внутри доверенной сети. Через интернет — только HTTPS.

**Как понять, что секрет уже прочитан?**
Ссылка перестанет работать и покажет «Секрет не найден».

---

<p align="center"><b>FarPass</b> · FARTECH · Farpost</p>
