export function renderHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ccusage dashboard</title>
<style>
:root { color-scheme: light dark; --bg: #fff; --fg: #1a1a1a; --muted: #666; --card: #f5f5f4; --line: #e5e5e5; --bar: #4f46e5; --bar2: #06b6d4; }
[data-theme="dark"] { --bg: #0f0f10; --fg: #ececec; --muted: #a1a1aa; --card: #18181b; --line: #2a2a2e; --bar: #818cf8; --bar2: #22d3ee; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
.wrap { max-width: 1024px; margin: 0 auto; padding: 24px 16px 64px; }
header { display: flex; gap: 12px; align-items: baseline; justify-content: space-between; flex-wrap: wrap; }
h1 { font-size: 22px; margin: 0; font-weight: 650; }
.sub { color: var(--muted); font-size: 13px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 16px 0; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
.card .k { font-size: 12px; color: var(--muted); }
.card .v { font-size: 22px; font-weight: 650; }
.card .s { font-size: 12px; color: var(--muted); }
section { margin-top: 28px; }
h2 { font-size: 16px; margin: 0 0 8px; }
button, .chip { font: inherit; background: var(--card); color: var(--fg); border: 1px solid var(--line); border-radius: 999px; padding: 4px 12px; cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.chart { display: flex; align-items: flex-end; gap: 4px; height: 140px; border: 1px solid var(--line); border-radius: 10px; padding: 12px; background: var(--card); overflow-x: auto; }
.bar { flex: 1 0 14px; min-width: 14px; background: var(--bar); border-radius: 3px 3px 0 0; position: relative; }
.bar.cost { background: var(--bar2); }
.bar:hover::after { content: attr(data-tip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: var(--fg); color: var(--bg); font-size: 11px; padding: 2px 6px; border-radius: 4px; white-space: nowrap; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { text-align: right; padding: 6px 8px; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums; }
th:first-child, td:first-child { text-align: left; }
th { color: var(--muted); font-weight: 500; }
.notice { border: 1px dashed var(--line); border-radius: 10px; padding: 16px; color: var(--muted); }
code { font-family: ui-monospace, monospace; font-size: 12.5px; }
.toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 12px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <h1>ccusage dashboard</h1>
      <div class="sub" id="meta">loading</div>
    </div>
    <div class="row">
      <button id="theme" type="button">toggle theme</button>
    </div>
  </header>
  <div class="toolbar" id="sources" role="group" aria-label="sources"></div>
  <div class="cards" id="cards"></div>
  <div id="empty"></div>
  <section>
    <h2>Daily tokens</h2>
    <div class="chart" id="chart-daily"></div>
  </section>
  <section>
    <h2>Monthly cost</h2>
    <div class="chart" id="chart-monthly"></div>
  </section>
  <section>
    <h2>Daily history</h2>
    <div style="overflow-x:auto"><table id="tbl-daily"></table></div>
  </section>
  <section>
    <h2>Monthly history</h2>
    <div style="overflow-x:auto"><table id="tbl-monthly"></table></div>
  </section>
  <section>
    <h2>Recent sessions</h2>
    <div style="overflow-x:auto"><table id="tbl-sessions"></table></div>
  </section>
  <p class="sub">Snapshot file. Rerun <code>ccusage-dash</code> to refresh. Pricing comes from ccusage.</p>
</div>
<script src="./data.js"></script>
<script>
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("ccusage-theme"); } catch (e) {}
  function apply(t) { if (t) root.setAttribute("data-theme", t); else root.removeAttribute("data-theme"); }
  if (saved) apply(saved);
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) apply("dark");
  document.getElementById("theme").onclick = function () {
    var cur = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(cur);
    try { localStorage.setItem("ccusage-theme", cur); } catch (e) {}
  };
  var D = window.__CCUSAGE__ || null;
  var meta = document.getElementById("meta");
  if (!D) { meta.textContent = "no data found next to this file"; return; }
  var gen = D.generatedAt ? new Date(D.generatedAt).toLocaleString() : "";
  meta.textContent = "snapshot " + gen + (D.ccusageAvailable ? "" : " - ccusage missing");
  var active = "all";
  var srcWrap = document.getElementById("sources");
  var srcs = ["all"].concat(D.sources || []);
  srcs.forEach(function (s) {
    var b = document.createElement("button");
    b.className = "chip"; b.textContent = s; b.setAttribute("aria-pressed", s === active ? "true" : "false");
    b.onclick = function () { active = s; paint(); };
    srcWrap.appendChild(b);
  });
  function money(n) { return "$" + Number(n || 0).toFixed(2); }
  function num(n) { return Number(n || 0).toLocaleString("en-US"); }
  function inSource(row) {
    if (active === "all") return true;
    if (row.byAgent && row.byAgent.length) return row.byAgent.some(function (a) { return a.agent === active; });
    return (row.agents || []).indexOf(active) !== -1;
  }
  function sliceFor(row) {
    if (active === "all" || !row.byAgent || !row.byAgent.length) return row;
    var f = row.byAgent.filter(function (a) { return a.agent === active; })[0];
    if (!f) return null;
    return { period: row.period, inputTokens: f.inputTokens, outputTokens: f.outputTokens, totalTokens: f.totalTokens, totalCost: f.totalCost, modelsUsed: f.modelsUsed || [] };
  }
  function paint() {
    var chips = srcWrap.querySelectorAll(".chip");
    chips.forEach(function (c) { c.setAttribute("aria-pressed", c.textContent === active ? "true" : "false"); });
    var daily = (D.daily || []).map(sliceFor).filter(Boolean).filter(inSource.length ? function (r) { return r; } : function () { return true; });
    // rebuild daily respecting filter
    daily = (D.daily || []).filter(inSource).map(sliceFor).filter(Boolean);
    var monthly = (D.monthly || []).filter(inSource).map(sliceFor).filter(Boolean);
    var today = daily[daily.length - 1];
    var month = monthly[monthly.length - 1];
    var totCost = daily.reduce(function (n, d) { return n + (d.totalCost || 0); }, 0);
    var totTok = daily.reduce(function (n, d) { return n + (d.totalTokens || 0); }, 0);
    var cards = document.getElementById("cards");
    cards.innerHTML = "";
    [["Today cost", today ? money(today.totalCost) : "-", today ? today.period : active],
     ["Today tokens", today ? num(today.totalTokens) : "-", today ? num(today.inputTokens) + " in / " + num(today.outputTokens) + " out" : ""],
     ["Month cost", month ? money(month.totalCost) : "-", month ? month.period : active],
     ["Period total", money(totCost), num(totTok) + " tokens in range"]
    ].forEach(function (c) {
      var el = document.createElement("div"); el.className = "card";
      el.innerHTML = '<div class="k"></div><div class="v"></div><div class="s"></div>';
      el.children[0].textContent = c[0]; el.children[1].textContent = c[1]; el.children[2].textContent = c[2];
      cards.appendChild(el);
    });
    var empty = document.getElementById("empty");
    if (!D.ccusageAvailable) {
      empty.innerHTML = '<div class="notice">ccusage data is missing. Install it with <code>npm i -g ccusage</code> or <code>bun add -g ccusage</code>, run an agent once, then rerun <code>ccusage-dash</code>. ' + (D.ccusageError ? "Detail: " + D.ccusageError : "") + '</div>';
    } else if (!daily.length) {
      empty.innerHTML = '<div class="notice">No usage rows for this filter. Try <code>all</code>, or check that Claude, Codex, or OpenCode have written local session files.</div>';
    } else empty.innerHTML = "";
    bars(document.getElementById("chart-daily"), daily.slice(-30), "totalTokens", false);
    bars(document.getElementById("chart-monthly"), monthly.slice(-12), "totalCost", true);
    table(document.getElementById("tbl-daily"), daily.slice().reverse().slice(0, 60), true);
    table(document.getElementById("tbl-monthly"), monthly.slice().reverse().slice(0, 24), true);
    stable(document.getElementById("tbl-sessions"), (D.sessions || []).slice(0, 20));
  }
  function bars(el, rows, key, isCost) {
    el.innerHTML = "";
    if (!rows.length) { el.textContent = "no data"; return; }
    var max = Math.max.apply(null, rows.map(function (r) { return r[key] || 0; }).concat([1]));
    rows.forEach(function (r) {
      var d = document.createElement("div");
      d.className = "bar" + (isCost ? " cost" : "");
      d.style.height = Math.max(3, Math.round((r[key] || 0) / max * 110)) + "px";
      d.style.flexGrow = "1";
      d.setAttribute("data-tip", r.period + " " + (isCost ? money(r[key]) : num(r[key])));
      el.appendChild(d);
    });
  }
  function table(el, rows, showModels) {
    if (!rows.length) { el.innerHTML = "<tr><td>no data</td></tr>"; return; }
    var h = "<tr><th>period</th><th>input</th><th>output</th><th>cache read</th><th>total</th><th>cost</th>" + (showModels ? "<th>models</th>" : "") + "</tr>";
    el.innerHTML = h + rows.map(function (r) {
      return "<tr><td>" + r.period + "</td><td>" + num(r.inputTokens) + "</td><td>" + num(r.outputTokens) + "</td><td>" + num(r.cacheReadTokens) + "</td><td>" + num(r.totalTokens) + "</td><td>" + money(r.totalCost) + "</td>" + (showModels ? "<td>" + (r.modelsUsed || r.models || []).join(", ") + "</td>" : "") + "</tr>";
    }).join("");
  }
  function stable(el, rows) {
    if (!rows.length) { el.innerHTML = "<tr><td>no sessions in range</td></tr>"; return; }
    el.innerHTML = "<tr><th>session</th><th>tokens</th><th>cost</th><th>models</th></tr>" + rows.map(function (r) {
      return "<tr><td>" + (r.sessionId || r.period || "?") + "</td><td>" + num(r.totalTokens) + "</td><td>" + money(r.totalCost) + "</td><td>" + (r.modelsUsed || []).join(", ") + "</td></tr>";
    }).join("");
  }
  paint();
})();
</script>
</body>
</html>`;
}
