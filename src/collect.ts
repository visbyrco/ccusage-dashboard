export const V1_SOURCES = ["claude", "codex", "opencode"] as const;
export type Source = (typeof V1_SOURCES)[number];

export interface ModelRow {
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  cost: number;
}

export interface AgentSlice {
  agent: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  totalCost: number;
  modelsUsed: string[];
}

export interface DayRow {
  period: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  totalTokens: number;
  totalCost: number;
  modelsUsed: string[];
  agents: string[];
  byAgent: AgentSlice[];
}

export interface SessionRow extends DayRow {
  sessionId?: string;
  project?: string;
}

export interface Report {
  generatedAt: string;
  ccusageAvailable: boolean;
  ccusageError?: string;
  sources: string[];
  daily: DayRow[];
  monthly: DayRow[];
  sessions: SessionRow[];
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const arr = (v: unknown) => (Array.isArray(v) ? v : []);

function toAgentSlice(a: any): AgentSlice {
  return {
    agent: String(a?.agent ?? "unknown"),
    inputTokens: num(a?.inputTokens),
    outputTokens: num(a?.outputTokens),
    cacheCreationTokens: num(a?.cacheCreationTokens),
    cacheReadTokens: num(a?.cacheReadTokens),
    totalTokens: num(a?.totalTokens ?? (num(a?.inputTokens) + num(a?.outputTokens))),
    totalCost: num(a?.totalCost ?? a?.cost),
    modelsUsed: arr(a?.modelsUsed).map(String),
  };
}

function toDayRow(d: any): DayRow {
  const rawAgents = arr(d?.agents);
  const agentNames =
    rawAgents.length > 0 && typeof rawAgents[0] === "object"
      ? rawAgents.map((a: any) => String(a?.agent ?? "")).filter(Boolean)
      : rawAgents.map(String);
  const agents = agentNames.length > 0 ? agentNames : arr(d?.metadata?.agents).map(String);
  return {
    period: String(d?.period ?? d?.date ?? d?.month ?? ""),
    inputTokens: num(d?.inputTokens),
    outputTokens: num(d?.outputTokens),
    cacheCreationTokens: num(d?.cacheCreationTokens),
    cacheReadTokens: num(d?.cacheReadTokens),
    totalTokens: num(d?.totalTokens),
    totalCost: num(d?.totalCost),
    modelsUsed: arr(d?.modelsUsed).map(String),
    agents,
    byAgent: arr(d?.agents).filter((a) => typeof a === "object").map(toAgentSlice),
  };
}

export function collectSources(
  known: string[],
  rows: Array<{ agents?: string[]; byAgent?: Array<{ agent: string }> }>
): string[] {
  const out = [...known];
  const seen = new Set(out);
  const extra: string[] = [];
  for (const r of rows) {
    const names = [...(r.agents ?? []), ...((r.byAgent ?? []).map((a) => a.agent))];
    for (const n of names) {
      const s = String(n ?? "").trim();
      if (s && !seen.has(s)) {
        seen.add(s);
        extra.push(s);
      }
    }
  }
  extra.sort();
  return [...out, ...extra];
}
export function normalizeReport(input: {
  daily: any;
  monthly: any;
  sessions: any;
  sources: string[];
  ccusageAvailable: boolean;
  ccusageError?: string;
}): Report {
  const dailyRaw = arr(input.daily?.daily ?? input.daily);
  const monthlyRaw = arr(input.monthly?.monthly ?? input.monthly);
  const sessionRaw = arr(
    (input.sessions as any)?.sessions ?? (input.sessions as any)?.session ?? input.sessions
  );
  const daily = dailyRaw.map(toDayRow).filter((d) => d.period);
  const monthly = monthlyRaw.map(toDayRow).filter((d) => d.period);
  const sessions: SessionRow[] = sessionRaw.map((s: any) => ({
    ...toDayRow(s),
    sessionId: s?.sessionId ? String(s.sessionId) : String(s?.period ?? ""),
    project: s?.project ? String(s?.project) : s?.metadata?.projectPath ? String(s.metadata.projectPath) : undefined,
  }));
  return {
    generatedAt: new Date().toISOString(),
    ccusageAvailable: input.ccusageAvailable,
    ccusageError: input.ccusageError,
    sources: collectSources(input.sources, [...daily, ...monthly, ...sessions]),
    daily,
    monthly,
    sessions,
  };
}

export function summarize(report: Report) {
  const today = report.daily[report.daily.length - 1];
  const month = report.monthly[report.monthly.length - 1];
  const totalCost = report.daily.reduce((n, d) => n + d.totalCost, 0);
  const totalTokens = report.daily.reduce((n, d) => n + d.totalTokens, 0);
  const perSource = new Map<string, { cost: number; tokens: number }>();
  for (const d of report.daily) {
    if (d.byAgent.length > 0) {
      for (const a of d.byAgent) {
        const cur = perSource.get(a.agent) ?? { cost: 0, tokens: 0 };
        cur.cost += a.totalCost;
        cur.tokens += a.totalTokens;
        perSource.set(a.agent, cur);
      }
    }
  }
  return { today, month, totalCost, totalTokens, perSource };
}

export function emptyReport(sources: string[], error?: string): Report {
  return {
    generatedAt: new Date().toISOString(),
    ccusageAvailable: false,
    ccusageError: error,
    sources,
    daily: [],
    monthly: [],
    sessions: [],
  };
}
