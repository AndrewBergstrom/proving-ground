#!/usr/bin/env bash
# Minimal host firewall for the judge box: allow SSH + HTTP/HTTPS only.
# The Judge0 API (2358), Postgres, and Redis stay on the internal docker
# network and are never exposed. Run as root on a fresh Ubuntu box.
#
# Also set a Hetzner Cloud Firewall in the console as a second layer:
#   inbound allow tcp/22 (ideally your IP only), tcp/80, tcp/443; deny the rest.
set -euo pipefail

if ! command -v ufw >/dev/null 2>&1; then
  apt-get update && apt-get install -y ufw
fi

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    comment 'SSH'
ufw allow 80/tcp    comment 'HTTP (ACME + redirect)'
ufw allow 443/tcp   comment 'HTTPS (judge API via Caddy)'
ufw --force enable
ufw status verbose

echo
echo "Firewall set: only 22, 80, 443 are open. Judge0/Postgres/Redis remain internal."
echo "Tip: in the Hetzner console, restrict tcp/22 to your own IP."
