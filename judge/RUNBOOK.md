# Judge box runbook

Stand up a self-hosted **Judge0** code judge on one dedicated Hetzner box, so
Proving Ground can compile and run Java, C#, C++, Go, and Rust (and ~55 more)
safely. The app stays a pure static site; only compiled languages call this box.

Budget ~30-40 minutes. You need: a Hetzner account, a domain you can add a DNS
record to, and the `judge/` folder from this repo.

---

## 0. Security model (read this first)

This box runs untrusted code from anyone who uses the app. Assume it can be
attacked. The defenses, in layers:

- **Dedicated + disposable.** Nothing sensitive on it. If it were popped, you
  lose a cheap VM and nothing else. Do not reuse it for other services.
- **Sandbox.** Judge0 runs each submission under `isolate` (namespaces +
  cgroups + seccomp) with **no network**, capped CPU/wall/memory/processes.
- **Not publicly reachable.** The Judge0 API is bound to the internal docker
  network. Only Caddy is public. Caddy injects the auth token, so nobody can
  hit the API directly.
- **CORS + rate limit.** Caddy only accepts browser calls from your app origin
  and throttles per IP (default 40 req/min) to blunt abuse/DoS.
- **Keep it patched.** Update the image and the OS; enable unattended upgrades.

The honest residual risk is abuse (cost/DoS), not compromise, as long as you
keep it updated and isolated.

---

## 1. Create the box

Hetzner Cloud -> new server:
- Image: **Ubuntu 24.04**
- Type: **CX22** (2 vCPU / 4 GB) is plenty. CPX11 works for light use.
- Add your SSH key.

Note the public IPv4.

## 2. DNS

Add an **A record**: `judge.yourdomain.com` -> the box IP. Wait until it
resolves (`dig +short judge.yourdomain.com`).

## 3. Base packages + Docker

SSH in as root, then:

```bash
apt-get update && apt-get upgrade -y
apt-get install -y ca-certificates curl git ufw unattended-upgrades
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
dpkg-reconfigure -f noninteractive unattended-upgrades   # auto security updates
```

## 4. Enable cgroup v1 (required by Judge0 1.13.1)

Judge0 1.13.x needs the legacy cgroup hierarchy. Ubuntu 24.04 defaults to v2,
so switch it and reboot:

```bash
sed -i 's/GRUB_CMDLINE_LINUX="\(.*\)"/GRUB_CMDLINE_LINUX="\1 systemd.unified_cgroup_hierarchy=0"/' /etc/default/grub
update-grub
reboot
```

(If you skip this, submissions hang or error in the isolate sandbox.)

## 5. Get the files + set secrets

```bash
git clone https://github.com/AndrewBergstrom/proving-ground.git
cd proving-ground/judge

cp judge0.conf.example judge0.conf
cp .env.example .env

# Generate three strong secrets:
openssl rand -hex 32   # -> AUTHN_TOKEN (also JUDGE0_AUTH_TOKEN in .env)
openssl rand -hex 32   # -> POSTGRES_PASSWORD
openssl rand -hex 32   # -> REDIS_PASSWORD
openssl rand -hex 32   # -> AUTHZ_TOKEN (admin)
```

Edit **judge0.conf**: paste the four secrets into `AUTHN_TOKEN`,
`AUTHZ_TOKEN`, `POSTGRES_PASSWORD`, `REDIS_PASSWORD`.

Edit **.env**: set `JUDGE_DOMAIN` (your judge subdomain), `APP_ORIGIN` (your
exact app URL, no trailing slash), `ACME_EMAIL`, and `JUDGE0_AUTH_TOKEN` (the
same value as `AUTHN_TOKEN`).

## 6. Firewall

```bash
bash setup-firewall.sh
```

Also add a Hetzner Cloud Firewall (console): allow inbound tcp/22 (your IP if
possible), tcp/80, tcp/443; deny the rest.

## 7. Launch

```bash
docker compose up -d --build   # first run builds the Caddy+ratelimit image
docker compose ps
docker compose logs -f caddy    # watch it obtain the TLS cert, then Ctrl-C
```

## 8. Verify it works and is locked down

```bash
# From the box, the internal API needs the token (proves auth is on):
curl -s http://localhost:2358/languages -H "X-Auth-Token: <AUTHN_TOKEN>" | head

# From your laptop, through Caddy (TLS + token injected). List languages:
curl -s https://judge.yourdomain.com/languages | python3 -m json.tool | head -40

# Run a quick submission (expects "hello"):
curl -s -X POST "https://judge.yourdomain.com/submissions?base64_encoded=false&wait=true" \
  -H "Content-Type: application/json" \
  -d '{"language_id":63,"source_code":"console.log(\"hello\")"}' | python3 -m json.tool

# Confirm the API is NOT reachable directly (should fail / time out):
curl -s --max-time 5 http://judge.yourdomain.com:2358/languages ; echo "  <- should be blocked"
```

Note the numeric `id` values from `/languages` for Java, C#, Mono, C++, Go,
Rust - the app resolves these automatically by name, but it is good to eyeball
them once.

## 9. Point the app at the judge

In the app repo, edit `assets/config.js`:

```js
JUDGE_URL: "https://judge.yourdomain.com",
```

Commit and push. Vercel redeploys; the language selector now shows the compiled
languages on problems that support them. Leaving `JUDGE_URL` blank keeps the
whole feature off (the app behaves exactly as before).

---

## Maintenance

- **Update Judge0/OS:** `docker compose pull && docker compose up -d`, and let
  unattended-upgrades handle the OS. Watch the Judge0 releases for security
  fixes and bump the pinned tag in `docker-compose.yml`.
- **Logs / abuse:** `docker compose logs caddy` shows access + rate-limit hits.
  Tighten `RATE_EVENTS` / `RATE_WINDOW` in `.env` if you see abuse.
- **Cost:** one CX22 is about EUR 4-5/mo. Power it off when not needed; the app
  degrades gracefully (compiled languages just disappear from the selector).
