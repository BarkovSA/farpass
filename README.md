![FarPass](logo/farpass-horizontal.svg)

# farpass - Share Secrets Securely

[![Go Report Card](https://goreportcard.com/badge/github.com/BarkovSA/farpass)](https://goreportcard.com/report/github.com/BarkovSA/farpass)
[![codecov](https://codecov.io/gh/BarkovSA/farpass/branch/master/graph/badge.svg)](https://codecov.io/gh/BarkovSA/farpass)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/BarkovSA/farpass?sort=semver)

![demo](https://ydemo.netlify.com/farpass-demo.gif)

farpass is a project for sharing secrets in a quick and secure manner.
The sole purpose of farpass is to minimize passwords floating around in ticket management systems, Slack messages, and emails. Messages are encrypted/decrypted locally in the browser and sent to farpass without the decryption key, which is only visible once during encryption. farpass then returns a one-time URL with a specified expiry date.

There is no perfect way of sharing secrets online, and there is a trade-off in every implementation. farpass is designed to be as simple and "dumb" as possible without compromising security. There's no mapping between the generated UUID and the user who submitted the encrypted message. It's always best to send all context except the password over another channel.

**[Demo available here](https://farpass.se)**. It's recommended to host farpass yourself if you care about security.

- End-to-End encryption using [OpenPGP](https://openpgpjs.org/)
- Secrets can only be viewed once
- No accounts or user management required
- Secrets self destruct after X hours
- Custom password option
- Limited file upload functionality

## History

farpass was first released in 2014 and has since been maintained by me and contributed to by this fantastic group of [contributors](https://github.com/BarkovSA/farpass/graphs/contributors). farpass is used by many large corporations, some of which are listed below.

If you are using farpass and want to support the project beyond code contributions, you can give thanks via email, consider donating, or give consent to list your company name as a user of farpass in this readme.

## Trusted by

- [Doddle LTD](https://doddle.com)
- [Spotify](https://spotify.com)
- [Gumtree Australia](https://www.gumtreeforbusiness.com.au/)

## Command-line interface

The main motivation of farpass is to make it easy for everyone to share secrets quickly via a simple web interface. A command-line interface is also provided to support use cases where program output needs to be shared.

```console
$ farpass --help
farpass - Secure sharing for secrets, passwords and files

Flags:
      --api string          farpass API server location (default "https://api.farpass.se")
      --decrypt string      Decrypt secret URL
      --expiration string   Duration after which secret will be deleted [1h, 1d, 1w] (default "1h")
      --file string         Read secret from file instead of stdin
      --key string          Manual encryption/decryption key
      --one-time            One-time download (default true)
      --url string          farpass public URL (default "https://farpass.se")

Settings are read from flags, environment variables, or a config file located at
~/.config/farpass/defaults.<json,toml,yml,hcl,ini,...> in this order. Environment
variables have to be prefixed with FarPass_ and dashes become underscores.

Examples:
      # Encrypt and share secret from stdin
      printf 'secret message' | farpass

      # Encrypt and share secret file
      farpass --file /path/to/secret.conf

      # Share secret multiple time a whole day
      cat secret-notes.md | farpass --expiration=1d --one-time=false

      # Decrypt secret to stdout
      farpass --decrypt https://farpass.se/#/...

Website: https://farpass.se
```

The following options are currently available to install the CLI locally.

- Compile from source (requires Go >= v1.21)

  ```console
  go install github.com/BarkovSA/farpass/cmd/farpass@latest
  ```

## Installation / Configuration

Here are the server configuration options.

Command line flags:

```console
$ farpass-server -h
      --address string             listen address (default 0.0.0.0)
      --database string            database backend ('memcached' or 'redis') (default "memcached")
      --max-length int             max length of encrypted secret (default 10000)
      --memcached string           Memcached address (default "localhost:11211")
      --metrics-port int           metrics server listen port (default -1)
      --port int                   listen port (default 1337)
      --redis string               Redis URL (default "redis://localhost:6379/0")
      --tls-cert string            path to TLS certificate
      --tls-key string             path to TLS key
      --cors-allow-origin          Access-Control-Allow-Origin CORS setting (default *)
      --force-onetime-secrets      reject non onetime secrets from being created
      --disable-upload             disable the /file upload endpoints
      --prefetch-secret            display information that the secret might be one time use (default true)
      --disable-features           disable features section on frontend
      --no-language-switcher       disable the language switcher in the UI
      --trusted-proxies strings    trusted proxy IP addresses or CIDR blocks for X-Forwarded-For header validation
      --privacy-notice-url string  URL to privacy notice page
      --imprint-url string         URL to imprint/legal notice page
```

Encrypted secrets can be stored either in Memcached or Redis by changing the `--database` flag.

### Proxy Configuration

When farpass is deployed behind a reverse proxy or load balancer (such as Nginx, Caddy, Cloudflare, or AWS ALB), you may want to log the real client IP addresses instead of the proxy's IP. farpass supports trusted proxy configuration for secure handling of `X-Forwarded-For` headers.

**Security Note**: X-Forwarded-For headers are only trusted when requests come from explicitly configured trusted proxies. This prevents IP spoofing from untrusted sources.

#### Examples:

```bash
# Trust a single proxy IP
farpass-server --trusted-proxies 192.168.1.100

# Trust multiple proxy IPs
farpass-server --trusted-proxies 192.168.1.100,10.0.0.50

# Trust proxy subnets (CIDR notation)
farpass-server --trusted-proxies 192.168.1.0/24,10.0.0.0/8

# Environment variable (useful for Docker)
export TRUSTED_PROXIES="192.168.1.0/24,10.0.0.0/8"
farpass-server
```

#### Common Proxy Scenarios:

- **Nginx/Apache**: Use the IP address of your reverse proxy server
- **Cloudflare**: Use Cloudflare's IP ranges (available from their documentation)
- **AWS ALB/ELB**: Use your VPC's CIDR block or the load balancer's subnet
- **Docker networks**: Use the Docker network's gateway IP or subnet

Without trusted proxies configured, farpass will always use the direct connection IP for security, which is the recommended default behavior.

### Docker Compose

Use the Docker Compose file `deploy/with-nginx-proxy-and-letsencrypt/docker-compose.yml` to set up a farpass instance with TLS transport encryption and automatic certificate renewal using [Let's Encrypt](https://letsencrypt.org/). First, point your domain to the host where you want to run farpass. Then replace the placeholder values for `VIRTUAL_HOST`, `LETSENCRYPT_HOST`, and `LETSENCRYPT_EMAIL` in the docker-compose.yml file with your values. Change to the deployment directory and start the containers:

```console
docker-compose up -d
```

farpass will then be available under the domain you specified through `VIRTUAL_HOST` / `LETSENCRYPT_HOST`.

Advanced users who already have a reverse proxy handling TLS connections can use the `insecure` setup:

```console
cd deploy/docker-compose/insecure
docker-compose up -d
```

Then point your reverse proxy to `127.0.0.1:80`.

### Docker

With TLS encryption

```console
docker run --name memcached_FarPass -d memcached
docker run -p 443:1337 -v /local/certs/:/certs \
    --link memcached_FarPass:memcached -d BarkovSA/farpass --memcached=memcached:11211 --tls-key=/certs/tls.key --tls-cert=/certs/tls.crt
```

farpass will then be available on port 443 through all IP addresses of the host, including public ones. To limit availability to a specific IP address, use `-p 127.0.0.1:443:1337`.

Without TLS encryption (needs a reverse proxy for transport encryption):

```console
docker run --name memcached_FarPass -d memcached
docker run -p 127.0.0.1:80:1337 --link memcached_FarPass:memcached -d BarkovSA/farpass --memcached=memcached:11211
```

Then point your reverse proxy that handles TLS connections to `127.0.0.1:80`.

### Kubernetes

```console
kubectl apply -f deploy/farpass-k8.yaml
kubectl port-forward service/farpass 1337:1337
```

_This is meant to get you started, please configure TLS when running farpass for real._

## Monitoring

farpass optionally provides metrics in the [OpenMetrics][] / [Prometheus][] text
format. Use flag `--metrics-port <port>` to let farpass start a second HTTP
server on that port making the metrics available on path `/metrics`.

Supported metrics:

- Basic [process metrics][] with prefix `process_` (e.g. CPU, memory, and file descriptor usage)
- Go runtime metrics with prefix `go_` (e.g. Go memory usage, garbage collection statistics, etc.)
- HTTP request metrics with prefix `FarPass_http_` (HTTP request counter, and HTTP request latency histogram)

[openmetrics]: https://openmetrics.io/
[prometheus]: https://prometheus.io/
[process metrics]: https://prometheus.io/docs/instrumenting/writing_clientlibs/#process-metrics

## Translations

farpass accepts translations for additional languages. The frontend includes internationalization support using react-i18next, see [current translations](https://github.com/BarkovSA/farpass/blob/master/website/src/shared/lib/i18n.ts). Translation contributions are welcome via pull requests, see example [here](https://github.com/BarkovSA/farpass/pull/3024) for adding a new language.
