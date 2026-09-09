import { $ } from "bun";

export async function runJson(cmd: string[], timeoutMs = 60000): Promise<{ ok: boolean; json: any; stderr: string }> {
  try {
    const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
    const timer = setTimeout(() => { try { proc.kill(); } catch {} }, timeoutMs);
    const [out, err] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    await proc.exited;
    clearTimeout(timer);
    const code = proc.exitCode ?? 1;
    if (code !== 0) return { ok: false, json: null, stderr: err.slice(0, 2000) || `exit ${code}` };
    const text = out.trim();
    if (!text) return { ok: false, json: null, stderr: "empty output" };
    return { ok: true, json: JSON.parse(text), stderr: "" };
  } catch (e: any) {
    return { ok: false, json: null, stderr: String(e?.message ?? e).slice(0, 2000) };
  }
}

async function probe(cmd: string[], timeoutMs = 60000): Promise<boolean> {
  try {
    const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
    const timer = setTimeout(() => { try { proc.kill(); } catch {} }, timeoutMs);
    const [out, err] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    await proc.exited;
    clearTimeout(timer);
    if ((proc.exitCode ?? 1) !== 0) return false;
    return (out + err).includes("USAGE") || (out + err).length > 0;
  } catch {
    return false;
  }
}

export async function whichCcusage(): Promise<string[] | null> {
  for (const cand of [["ccusage"], ["bunx", "ccusage"], ["npx", "-y", "ccusage"]]) {
    if (await probe([...cand, "--help"])) return cand;
  }
  return null;
}

export async function collectAll(base: string[], opts: { since?: string; until?: string; offline: boolean }) {
  const extra: string[] = ["--json", "--by-agent"];
  if (opts.since) extra.push("--since", opts.since);
  if (opts.until) extra.push("--until", opts.until);
  if (opts.offline) extra.push("--offline");
  const [daily, monthly, sessions] = await Promise.all([
    runJson([...base, "daily", ...extra]),
    runJson([...base, "monthly", ...extra]),
    runJson([...base, "session", ...extra]),
  ]);
  return { daily, monthly, sessions };
}
