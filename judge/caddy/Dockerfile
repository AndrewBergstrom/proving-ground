# Caddy with the rate-limit plugin (not in the stock image), built via xcaddy.
# Gives us automatic HTTPS + per-IP rate limiting in one small binary.
FROM caddy:2-builder AS builder
RUN xcaddy build --with github.com/mholt/caddy-ratelimit

FROM caddy:2
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
