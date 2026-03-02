# ── Stage 1: Go build ─────────────────────────────────────────────────────────
# Версия пинится под go.mod (go 1.24.0). При обновлении go.mod — менять сюда же.
FROM golang:1.24-bookworm AS app

RUN mkdir -p /farpass
WORKDIR /farpass

# Сначала только манифесты зависимостей — слой кэшируется до изменения go.mod/go.sum
COPY go.mod go.sum ./
RUN go mod download

# Исходники копируем после: при изменении кода зависимости не качаются заново
COPY . .

# CGO_ENABLED=0  → статический бинарь (работает в distroless без libc)
# -ldflags -s -w → убираем debug-символы (~30% меньше)
RUN CGO_ENABLED=0 GOOS=linux \
    go build -ldflags="-s -w" -o farpass       ./cmd/farpass && \
    go build -ldflags="-s -w" -o farpass-server ./cmd/farpass-server

# ── Stage 2: Frontend build ────────────────────────────────────────────────────
# oven/bun — быстрый JS-рантайм с встроенным пакетным менеджером
FROM oven/bun:1 AS website

WORKDIR /website

# Только манифесты — bun install кэшируется до изменения package.json / bun.lock
COPY website/package.json website/bun.lock ./
RUN bun install --frozen-lockfile

# Исходники — после install, чтобы не инвалидировать кэш зависимостей
COPY website/ .
RUN bun run build

# ── Stage 3: Финальный образ (минимальный, без shell и лишних утилит) ──────────
FROM gcr.io/distroless/base-debian12

LABEL org.opencontainers.image.title="FarPass" \
      org.opencontainers.image.description="Secure one-time secret sharing" \
      org.opencontainers.image.source="https://github.com/BarkovSA/farpass"

COPY --from=app /farpass/farpass /farpass/farpass-server /
COPY --from=website /website/dist /public

USER 1000
ENTRYPOINT ["/farpass-server"]
