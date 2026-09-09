import { describe, expect, test } from "bun:test";
import { collectSources, emptyReport, normalizeReport, summarize } from "../src/collect";
import { renderHtml } from "../src/html";

const sample = {
  daily: { daily: [{ period: "2026-09-01", inputTokens: 100, outputTokens: 50, cacheReadTokens: 10, totalTokens: 160, totalCost: 1.5, modelsUsed: ["gpt-5"], metadata: { agents: ["opencode"] }, agents: [{ agent: "opencode", inputTokens: 100, outputTokens: 50, totalTokens: 160, totalCost: 1.5, modelsUsed: ["gpt-5"] }] }] },
  monthly: { monthly: [{ period: "2026-09", inputTokens: 100, outputTokens: 50, totalTokens: 160, totalCost: 1.5, modelsUsed: ["gpt-5"], metadata: { agents: ["opencode"] }, agents: [] }] },
  sessions: { sessions: [{ sessionId: "abc", inputTokens: 10, outputTokens: 5, totalTokens: 15, totalCost: 0.1, modelsUsed: ["gpt-5"], metadata: { agents: ["codex"] } }] },
};

describe("normalize", () => {
  test("keeps periods and agents", () => {
    const r = normalizeReport({ ...sample, sources: ["claude", "codex", "opencode"], ccusageAvailable: true });
    expect(r.daily.length).toBe(1);
    expect(r.daily[0].agents).toEqual(["opencode"]);
    expect(r.daily[0].byAgent[0].agent).toBe("opencode");
    expect(r.sessions[0].sessionId).toBe("abc");
  });
  test("discovers sources beyond the cli seed list", () => {
    const r = normalizeReport({ ...sample, sources: ["claude"], ccusageAvailable: true });
    expect(r.sources).toContain("claude");
    expect(r.sources).toContain("opencode");
    expect(r.sources).toContain("codex");
    expect(collectSources(["claude"], [{ agents: ["zeta"], byAgent: [{ agent: "alpha" }] }])).toEqual([
      "claude",
      "alpha",
      "zeta",
    ]);
  });
  test("summarize totals", () => {
    const r = normalizeReport({ ...sample, sources: ["opencode"], ccusageAvailable: true });
    const s = summarize(r);
    expect(s.totalCost).toBeCloseTo(1.5);
    expect(s.perSource.get("opencode")?.tokens).toBe(160);
  });
  test("empty report marks ccusage missing", () => {
    const r = emptyReport(["claude"], "nope");
    expect(r.ccusageAvailable).toBe(false);
    expect(r.daily).toEqual([]);
  });
  test("html loads data.js global", () => {
    expect(renderHtml()).toContain("window.__CCUSAGE__");
    expect(renderHtml()).toContain('src="./data.js"');
  });
});

describe("session key", () => {
  test("reads singular session key and projectPath", async () => {
    const { normalizeReport } = await import("../src/collect");
    const r = normalizeReport({
      daily: { daily: [] }, monthly: { monthly: [] },
      sessions: { session: [{ period: "abc-123", inputTokens: 10, outputTokens: 5, totalTokens: 15, totalCost: 0.1, modelsUsed: ["m"], metadata: { agents: ["codex"], projectPath: "my-proj" } }] },
      sources: ["codex"], ccusageAvailable: true,
    });
    if (r.sessions.length !== 1) throw new Error("expected 1 session");
    if (r.sessions[0].sessionId !== "abc-123") throw new Error("bad session id");
    if (r.sessions[0].project !== "my-proj") throw new Error("bad project");
  });
});
