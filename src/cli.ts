#!/usr/bin/env bun
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { collectAll, whichCcusage } from "./run";
import { V1_SOURCES, emptyReport, normalizeReport } from "./collect";
import { renderHtml } from "./html";

const VERSION = "0.1.0";

function help(): string {
  return `ccusage-dash ${VERSION}
Static dashboard for ccusage. Writes a folder and opens it. No server.

Usage:
  ccusage-dash [options]

Options:
  --out <dir>       Output dir (default ~/.cache/ccusage-dash)
  --no-open         Write files but do not open the browser
  --since <date>    Pass through to ccusage (YYYY-MM-DD)
  --until <date>    Pass through to ccusage (inclusive)
  --offline         Use cached pricing where supported
  --source <name>   Limit chips to a source, repeatable (default claude,codex,opencode)
  -h, --help        Show this text
  -v, --version     Show version`;
}

function args(argv: string[]) {
  const o: any = { out: "", open: true, since: "", until: "", offline: false, sources: [...V1_SOURCES] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") { console.log(help()); process.exit(0); }
    else if (a === "-v" || a === "--version") { console.log(VERSION); process.exit(0); }
    else if (a === "--no-open") o.open = false;
    else if (a === "--offline") o.offline = true;
    else if (a === "--out") o.out = argv[++i] ?? "";
    else if (a === "--since") o.since = argv[++i] ?? "";
    else if (a === "--until") o.until = argv[++i] ?? "";
    else if (a === "--source") {
      const v = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      if (v.length) o.sources = v;
    }
    else { console.error(`unknown flag ${a}\n${help()}`); process.exit(1); }
  }
  if (!o.out) o.out = join(homedir(), ".cache", "ccusage-dash");
  return o;
}

async function openFile(path: string) {
  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const argv = process.platform === "win32" ? ["/c", "start", "", path] : [path];
  try {
    const p = Bun.spawn([opener, ...argv], { stdout: "ignore", stderr: "ignore" });
    p.unref?.();
  } catch (e: any) {
    console.error(`Open this file by hand:\n${path}`);
  }
}

const o = args(process.argv.slice(2));
const base = await whichCcusage();

let report: any;
if (!base) {
  report = emptyReport(o.sources, "ccusage not found on PATH (tried ccusage, bunx ccusage, npx ccusage)");
} else {
  const res = await collectAll(base, o);
  const fails = [res.daily, res.monthly, res.sessions].filter((r) => !r.ok);
  if (fails.length === 3) {
    report = emptyReport(o.sources, res.daily.stderr || "ccusage returned no JSON");
  } else {
    report = normalizeReport({
      daily: res.daily.json ?? [],
      monthly: res.monthly.json ?? [],
      sessions: res.sessions.json ?? [],
      sources: o.sources,
      ccusageAvailable: true,
      ccusageError: fails.length ? fails[0].stderr : undefined,
    });
  }
}

await Bun.$`mkdir -p ${o.out}`.quiet();
const html = renderHtml();
await Bun.write(join(o.out, "dashboard.html"), html);
await Bun.write(
  join(o.out, "data.js"),
  `window.__CCUSAGE__ = ${JSON.stringify(report)};\n`
);
await Bun.write(join(o.out, "report.json"), JSON.stringify(report, null, 2));
await Bun.write(join(o.out, "daily.json"), JSON.stringify(report.daily ?? [], null, 2));
await Bun.write(join(o.out, "monthly.json"), JSON.stringify(report.monthly ?? [], null, 2));
await Bun.write(join(o.out, "sessions.json"), JSON.stringify(report.sessions ?? [], null, 2));

const page = join(o.out, "dashboard.html");
console.log(`wrote ${page}`);
console.log(`days: ${report.daily?.length ?? 0} months: ${report.monthly?.length ?? 0} sessions: ${report.sessions?.length ?? 0}`);
if (!report.ccusageAvailable) console.log("ccusage missing, page shows setup help.");
if (o.open) await openFile(page);
