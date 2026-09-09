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

```bash
curl -fsSL https://raw.githubusercontent.com/charlie/ccusage-dashboard/main/install.sh | bash
ccusage-dash
```

The script pulls a compiled binary when a release exists, else builds from source with bun.

## Test

```bash
bun test
```
