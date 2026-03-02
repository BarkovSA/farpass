FROM golang:bookworm AS app
RUN mkdir -p /farpass
WORKDIR /farpass
COPY . .
RUN go build ./cmd/farpass && go build ./cmd/farpass-server

FROM node:22 AS website
COPY website /website
WORKDIR /website
RUN yarn install --network-timeout 600000 && yarn build

FROM gcr.io/distroless/base
COPY --from=app /farpass/farpass /farpass/farpass-server /
COPY --from=website /website/dist /public
USER 1000
ENTRYPOINT ["/farpass-server"]
