#!/usr/bin/env bash
# ccusage-dash installer. Downloads a compiled binary when present,
# otherwise builds from source with bun.
set -euo pipefail
REPO="${REPO:-visbyrco/ccusage-dashboard}"
BIN="${BIN:-ccusage-dash}"
DEST="${DEST:-$HOME/.local/bin}"
VERSION="${VERSION:-latest}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing $1" >&2; return 1; }; }

os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m)"
case "$os-$arch" in
  linux-x86_64) target="bun-linux-x64" ;;
  linux-aarch64) target="bun-linux-arm64" ;;
  darwin-arm64|darwin-aarch64) target="bun-darwin-arm64" ;;
  darwin-x86_64) target="bun-darwin-x64" ;;
  *) echo "unsupported $os $arch, building from source"; target="source" ;;
esac

mkdir -p "$DEST"
url=""
if [ "$VERSION" = "latest" ]; then
  url="https://github.com/$REPO/releases/latest/download/$BIN-$target"
else
  url="https://github.com/$REPO/releases/download/$VERSION/$BIN-$target"
fi

if [ "$target" != "source" ] && need curl; then
  if curl -fsSL "$url" -o "$DEST/$BIN" 2>/dev/null; then
    chmod +x "$DEST/$BIN"
    echo "installed $DEST/$BIN"
    echo "run: $BIN"
    exit 0
  fi
  echo "no release binary at $url, trying source build"
fi

need bun || { echo "install bun (https://bun.sh) or rerun when a release exists" >&2; exit 1; }
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
if need git; then
  git clone --depth 1 "https://github.com/$REPO" "$tmp/app"
else
  echo "git is required for source install" >&2; exit 1
fi
(cd "$tmp/app" && bun install --production >/dev/null 2>&1 || bun install >/dev/null 2>&1; bun build --compile src/cli.ts --outfile "$DEST/$BIN")
chmod +x "$DEST/$BIN"
echo "installed $DEST/$BIN from source"
echo "run: $BIN"
