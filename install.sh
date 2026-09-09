#!/usr/bin/env bash
# ccusage-dash installer. Downloads a compiled binary when present,
# otherwise builds from source with bun.
#
# Channels:
#   main (default) - stable releases built from the main branch.
#   nightly        - dev builds from the nightly branch.
#
# Usage:
#   install.sh [--channel main|nightly] [--version TAG] [--nightly]
#   CHANNEL=nightly install.sh
#   CHANNEL=nightly VERSION=nightly-2026.01.02 install.sh
set -euo pipefail
REPO="${REPO:-visbyrco/ccusage-dashboard}"
BIN="${BIN:-ccusage-dash}"
DEST="${DEST:-$HOME/.local/bin}"
CHANNEL="${CHANNEL:-main}"
VERSION="${VERSION:-}"

usage() {
  echo "usage: install.sh [--channel main|nightly] [--version TAG] [--nightly] [--stable]" >&2
}

while [ $# -gt 0 ]; do
  case "$1" in
    --channel) CHANNEL="${2:-}"; shift 2 ;;
    --channel=*) CHANNEL="${1#--channel=}"; shift ;;
    --nightly) CHANNEL="nightly"; shift ;;
    --stable|--main) CHANNEL="main"; shift ;;
    --version) VERSION="${2:-}"; shift 2 ;;
    --version=*) VERSION="${1#--version=}"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown flag $1" >&2; usage; exit 1 ;;
  esac
done

case "$CHANNEL" in
  main|stable) CHANNEL="main" ;;
  nightly|night|dev) CHANNEL="nightly" ;;
  *) echo "unknown channel $CHANNEL (want main or nightly)" >&2; exit 1 ;;
esac

# Default tag per channel: stable resolves to the latest stable release,
# nightly follows the moving nightly prerelease.
if [ -z "$VERSION" ]; then
  if [ "$CHANNEL" = "nightly" ]; then VERSION="nightly"; else VERSION="latest"; fi
fi

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

# Authenticated download via gh. Needed while the repo is private,
# plain curl gets a 404 on private release assets.
if need gh; then
  tag="$VERSION"
  if [ "$tag" = "latest" ]; then
    tag="$(gh release view --repo "$REPO" --json tagName -q .tagName 2>/dev/null || true)"
  fi
  if [ -n "$tag" ] && gh release download "$tag" --repo "$REPO" --pattern "$BIN-$target" --dir "$DEST" --clobber >/dev/null 2>&1; then
    # gh keeps the asset filename, normalize it to $BIN
    if [ -f "$DEST/$BIN-$target" ]; then
      mv -f "$DEST/$BIN-$target" "$DEST/$BIN"
    fi
    chmod +x "$DEST/$BIN"
    if "$DEST/$BIN" --version >/dev/null 2>&1; then
      echo "installed $DEST/$BIN ($tag)"
      echo "run: $BIN"
      exit 0
    fi
    echo "downloaded binary fails to run, continuing" >&2
  fi
fi

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
echo "using $(command -v bun) ($(bun --version))"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
if need git; then
  if [ "$CHANNEL" = "nightly" ]; then
    git clone --depth 1 --branch nightly "https://github.com/$REPO" "$tmp/app"
  else
    git clone --depth 1 --branch main "https://github.com/$REPO" "$tmp/app"
  fi
else
  echo "git is required for source install" >&2; exit 1
fi
(cd "$tmp/app" && bun install --production >/dev/null 2>&1 || bun install >/dev/null 2>&1; bun build --compile src/cli.ts --outfile "$DEST/$BIN")
chmod +x "$DEST/$BIN"
if "$DEST/$BIN" --version >/dev/null 2>&1; then
  echo "installed $DEST/$BIN from source"
  echo "run: $BIN"
  exit 0
fi
echo "compile produced a broken binary here, falling back to a bun-run shim" >&2
rm -f "$DEST/$BIN"
share="$HOME/.local/share/ccusage-dash"
rm -rf "$share"
cp -r "$tmp/app" "$share"
printf '#!/usr/bin/env bash\nexec bun "%s/src/cli.ts" "$@"\n' "$share" > "$DEST/$BIN"
chmod +x "$DEST/$BIN"
"$DEST/$BIN" --version || { echo "shim does not run either, aborting" >&2; exit 1; }
echo "installed $DEST/$BIN (bun-run shim)"
echo "run: $BIN"
