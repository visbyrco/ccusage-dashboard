# ccusage-dash

Static browser dashboard for ccusage. No server, no port.

## Run

```bash
bun install
bun src/cli.ts
bun src/cli.ts --no-open --out /tmp/dash
```

This writes `dashboard.html`, `data.js`, and raw JSON into `~/.cache/ccusage-dash/` and opens the page in your browser. Rerun to refresh.

## Flags

`--out`, `--no-open`, `--since`, `--until`, `--offline`, `--source` (repeatable).

## Install

Stable (main branch):

```bash
curl -fsSL https://raw.githubusercontent.com/visbyrco/ccusage-dashboard/main/install.sh | bash
ccusage-dash
```

Nightly (dev builds from the nightly branch):

```bash
curl -fsSL https://raw.githubusercontent.com/visbyrco/ccusage-dashboard/nightly/install.sh | bash -s -- --nightly
```

Or pin a version explicitly: `bash -s -- --version v0.1.0` for stable,
`CHANNEL=nightly VERSION=nightly` for the latest nightly.

The script pulls a compiled binary when a release exists, else builds from source with bun.

## Branches

I keep two long-lived branches. `nightly` is where dev happens. When a batch
of nightly changes looks ready I merge `nightly` into `main`.

Pushing to either branch builds release binaries through
`.github/workflows/release.yml`. Pushes to `main` publish a versioned stable
release (`vX.Y.Z` from `package.json`, marked latest). Pushes to `nightly`
update a moving `nightly` prerelease, so the stable `latest` download keeps
pointing at main.

## Test

```bash
bun test
```
