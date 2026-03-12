## Как внести вклад в FarPass

Прежде всего — спасибо, что хотите помочь FarPass! 🎉

### Начало работы

**Требования**

- Бэкенд: Go 1.21+, Redis или Memcached, Git
- Фронтенд: Node.js 18+, Bun, современный браузер

### Локальная настройка

```bash
git clone https://github.com/BarkovSA/farpass.git
cd farpass
```

Бэкенд (разработка):

```bash
docker run -d -p 6379:6379 redis:alpine
go run cmd/farpass-server/main.go --redis=redis://localhost:6379/0
```

Фронтенд:

```bash
cd website/
bun install
bun dev
```

### Качество кода и тесты

Фронтенд:

```bash
cd website/
yarn lint
yarn format
yarn build
```

Бэкенд:

```bash
go fmt ./...
golangci-lint run
go vet ./...
```

Тестирование:

Фронтенд: `bun run test`
Бэкенд: `go test ./...` и `go test -cover ./...`

Требования к покрытию: unit, integration, e2e; 100% для крипто-критичных мест.

### Pull requests

Перед PR:

1. Обсудите крупные изменения в issue
2. Небольшие баг-фиксы можно прямо в PR
3. Следуйте стилю кода

Обязательное в PR:

- тесты
- проходящий линт
- обновлённая дока при необходимости

Шаблон PR описан в репозитории.

### Как помочь

- документация
- тесты
- доступность
- локализация
- производительность
- безопасность

### Установка и деплой

Docker-compose:

```bash
cd deploy/
docker-compose up -d
```

Для продакшена смотрите `deploy/`.

---

Спасибо за вклад в FarPass! 🔐
