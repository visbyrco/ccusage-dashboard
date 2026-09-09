export function renderHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ccusage dashboard</title>
<style>
:root {
  color-scheme: light dark;
  --wrap-max: 1120px;
  --bg: #f6f7f9; --bg-soft: #eef0f3;
  --card: #ffffff; --card-2: #fbfbfc;
  --fg: #131316; --fg-2: #3f3f46; --muted: #71717a;
  --line: #e4e4e7; --line-soft: #efeff1;
  --accent: #4f46e5; --accent-ink: #4338ca;
  --accent-soft: rgba(79,70,229,.10);
  --teal: #0e7490; --teal-soft: rgba(6,182,212,.12);
  --amber: #b45309; --amber-soft: rgba(245,158,11,.14);
  --radius: 14px; --radius-sm: 10px;
  --shadow: 0 1px 2px rgba(16,16,20,.06), 0 8px 24px -16px rgba(16,16,20,.18);
  --mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace;
  --sans: ui-sans-system, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
[data-theme="dark"] {
  --bg: #09090c; --bg-soft: #0e0e12;
  --card: #121216; --card-2: #17171d;
  --fg: #f4f4f5; --fg-2: #d4d4d8; --muted: #9b9ba4;
  --line: #232329; --line-soft: #1a1a20;
  --accent: #818cf8; --accent-ink: #c7d2fe;
  --accent-soft: rgba(129,140,248,.14);
  --teal: #22d3ee; --teal-soft: rgba(34,211,238,.13);
  --amber: #fbbf24; --amber-soft: rgba(251,191,36,.13);
  --shadow: 0 1px 2px rgba(0,0,0,.4), 0 16px 40px -24px rgba(0,0,0,.7);
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.55 var(--sans); letter-spacing: -0.006em; transition: background .2s ease, color .2s ease; }
body::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(900px 320px at 15% -80px, rgba(79,70,229,.10), transparent 70%), radial-gradient(700px 260px at 90% -60px, rgba(6,182,212,.08), transparent 70%);
}
[data-theme="dark"] body::before {
  background: radial-gradient(900px 320px at 15% -80px, rgba(129,140,248,.12), transparent 70%), radial-gradient(700px 260px at 90% -60px, rgba(34,211,238,.08), transparent 70%);
}
.topbar { position: sticky; top: 0; z-index: 20; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  background: color-mix(in srgb, var(--bg) 82%, transparent); border-bottom: 1px solid var(--line); }
.topbar-inner { max-width: var(--wrap-max, 1120px); margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.mark { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; flex: none;
  background: linear-gradient(135deg, #4f46e5, #06b6d4); color: #fff; box-shadow: 0 6px 18px -8px rgba(79,70,229,.7); }
.mark svg { width: 18px; height: 18px; }
.brand h1 { font-size: 15px; margin: 0; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
.brand h1 span { color: var(--muted); font-weight: 500; }
.brand .meta { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.top-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.live { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--fg-2);
  background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 6px 11px; font-variant-numeric: tabular-nums; }
.live i { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,.18); flex: none; }
.iconbtn { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; cursor: pointer;
  background: var(--card); border: 1px solid var(--line); color: var(--fg-2); transition: transform .15s ease, border-color .15s ease, background .15s ease; }
.iconbtn:hover { border-color: var(--muted); transform: translateY(-1px); }
.iconbtn:active { transform: scale(.96); }
.iconbtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.iconbtn svg { width: 17px; height: 17px; }
.wrap { position: relative; z-index: 1; max-width: var(--wrap-max, 1120px); margin: 0 auto; padding: 22px 20px 72px; }
[data-width="wide"] { --wrap-max: 1440px; }
[data-width="full"] { --wrap-max: none; }
[data-width="full"] .wrap { padding-left: 28px; padding-right: 28px; }
.controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 18px 0 16px; }
.controls .label { font-size: 11.5px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.seg { display: inline-flex; background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 3px; gap: 2px; box-shadow: var(--shadow); }
.seg button { font: inherit; font-size: 13px; font-weight: 550; border: 0; background: transparent; color: var(--muted);
  border-radius: 999px; padding: 7px 14px; cursor: pointer; min-height: 34px; transition: all .16s ease; }
.seg button:hover { color: var(--fg); }
.seg button[aria-pressed="true"] { background: var(--fg); color: var(--bg); box-shadow: 0 2px 8px rgba(0,0,0,.18); }
.seg button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.range-note { margin-left: auto; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin: 6px 0 4px; }
[data-cards="4"] .cards { grid-template-columns: repeat(4, 1fr); }
[data-cards="2"] .cards { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 900px) { [data-cards="4"] .cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .cards, [data-cards="4"] .cards, [data-cards="2"] .cards { grid-template-columns: 1fr; } }
.card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 15px 13px;
  box-shadow: var(--shadow); position: relative; overflow: hidden; transition: transform .16s ease, border-color .16s ease;
  animation: rise .45s ease both; }
.card:nth-child(2) { animation-delay: .05s; } .card:nth-child(3) { animation-delay: .1s; } .card:nth-child(4) { animation-delay: .15s; }
.card:hover { transform: translateY(-1px); border-color: color-mix(in srgb, var(--muted) 55%, transparent); }
.card::after { content: ""; position: absolute; inset: auto -20% -55% -20%; height: 90px; pointer-events: none; opacity: .7;
  background: radial-gradient(closest-side, var(--accent-soft), transparent 70%); }
.card-top { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
.glyph { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; flex: none; }
.glyph svg { width: 15px; height: 15px; }
.g1 { background: var(--accent-soft); color: var(--accent-ink); }
.g2 { background: var(--teal-soft); color: var(--teal); }
.g3 { background: var(--amber-soft); color: var(--amber); }
.g4 { background: color-mix(in srgb, #22c55e 14%, transparent); color: #16a34a; }
[data-theme="dark"] .g4 { color: #4ade80; }
.card .k { font-size: 11.5px; font-weight: 650; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
.card .v { font-family: var(--mono); font-size: 27px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.card .s { font-size: 12.5px; color: var(--muted); margin-top: 7px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.grid2 { display: grid; grid-template-columns: 1.35fr .9fr; gap: 12px; margin-top: 12px; }
[data-charts="stacked"] .grid2 { grid-template-columns: 1fr; }
[data-charts="columns"] .grid2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 900px) { .grid2, [data-charts="columns"] .grid2 { grid-template-columns: 1fr; } }
[data-density="compact"] .grid2 { gap: 8px; margin-top: 8px; }
[data-density="compact"] .cards { gap: 8px; }
[data-density="compact"] .card { padding: 10px 12px 9px; }
[data-density="compact"] .card .v { font-size: 22px; }
[data-density="compact"] .chart { height: 160px; }
[hidden] { display: none !important; }
.menuwrap { position: relative; }
.menu { position: absolute; right: 0; top: calc(100% + 8px); z-index: 30; width: 264px;
  background: var(--card); border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow); padding: 12px; }
.menu h3 { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); margin: 10px 2px 6px; }
.menu h3:first-child { margin-top: 0; }
.menu .row { display: flex; gap: 6px; flex-wrap: wrap; }
.menu .row button { font: inherit; font-size: 12.5px; font-weight: 600; border: 1px solid var(--line); background: var(--bg-soft);
  color: var(--fg-2); border-radius: 999px; padding: 6px 11px; cursor: pointer; }
.menu .row button[aria-pressed="true"] { background: var(--fg); border-color: var(--fg); color: var(--bg); }
.menu .row button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.panel { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; animation: rise .5s ease both; }
.panel-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding: 14px 16px 4px; }
.panel-head h2 { font-size: 14px; margin: 0; font-weight: 700; letter-spacing: -0.01em; }
.panel-head .hint { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.panel-head .total { margin-left: auto; font-family: var(--mono); font-size: 13px; font-weight: 650; color: var(--fg-2);
  background: var(--bg-soft); border: 1px solid var(--line-soft); padding: 3px 9px; border-radius: 999px; font-variant-numeric: tabular-nums; }
.legend { display: flex; gap: 12px; padding: 8px 16px 0; font-size: 12px; color: var(--muted); }
.dot { width: 8px; height: 8px; border-radius: 3px; display: inline-block; margin-right: 6px; vertical-align: baseline; }
.chart { position: relative; display: flex; align-items: flex-end; gap: 5px; height: 196px; margin: 10px 12px 6px; padding: 14px 12px 26px 40px;
  background: var(--card-2); border: 1px solid var(--line-soft); border-radius: var(--radius-sm); overflow-x: auto; overflow-y: hidden;
  background-image: linear-gradient(var(--line-soft) 1px, transparent 1px); background-size: 100% 32px; background-position: 0 14px; background-repeat: repeat-y; }
.yaxis { position: absolute; left: 6px; top: 14px; bottom: 26px; display: flex; flex-direction: column; justify-content: space-between;
  font-family: var(--mono); font-size: 10px; color: var(--muted); text-align: right; width: 28px; font-variant-numeric: tabular-nums; }
.bar { flex: 1 0 12px; min-width: 12px; max-width: 44px; border-radius: 5px 5px 2px 2px; position: relative; cursor: pointer;
  background: linear-gradient(180deg, #818cf8, #4f46e5); border: 0; padding: 0; min-height: 3px;
  transition: filter .15s ease, transform .15s ease; }
.bar.cost { background: linear-gradient(180deg, #22d3ee, #0891b2); }
.bar:hover, .bar:focus-visible { filter: brightness(1.15); outline: none; }
.bar:focus-visible { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
.bar.today { box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.55); }
.bar .tip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px); opacity: 0; pointer-events: none;
  background: var(--fg); color: var(--bg); font-size: 11.5px; font-family: var(--mono); padding: 5px 8px; border-radius: 7px; white-space: nowrap;
  transition: opacity .15s ease, transform .15s ease; z-index: 5; font-variant-numeric: tabular-nums; }
.bar:hover .tip, .bar:focus-visible .tip { opacity: 1; transform: translateX(-50%) translateY(0); }
.xlabels { display: flex; justify-content: space-between; padding: 0 16px 12px 52px; font-family: var(--mono); font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
section.block { margin-top: 12px; }
.tbl-wrap { overflow-x: auto; border-top: 1px solid var(--line-soft); }
table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 760px; }
thead th { position: sticky; top: 0; background: var(--card); z-index: 1; font-size: 11px; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; color: var(--muted); text-align: right; padding: 10px 12px; border-bottom: 1px solid var(--line); white-space: nowrap; }
thead th:first-child, tbody td:first-child { text-align: left; }
tbody td { text-align: right; padding: 9px 12px; border-bottom: 1px solid var(--line-soft); font-variant-numeric: tabular-nums; }
tbody tr:last-child td { border-bottom: 0; }
tbody tr { transition: background .12s ease; }
tbody tr:hover { background: color-mix(in srgb, var(--accent-soft) 45%, transparent); }
td.num, td.cost { font-family: var(--mono); font-size: 12.8px; }
td.cost { font-weight: 650; }
td.period { font-family: var(--mono); font-size: 12.5px; color: var(--fg-2); white-space: nowrap; }
.pill { display: inline-block; font-family: var(--mono); font-size: 11px; background: var(--bg-soft); border: 1px solid var(--line);
  color: var(--fg-2); border-radius: 999px; padding: 2px 8px; margin: 1px 2px 1px 0; white-space: nowrap; max-width: 240px; overflow: hidden; text-overflow: ellipsis; vertical-align: middle; }
.count { font-family: var(--mono); font-size: 11.5px; background: var(--bg-soft); border: 1px solid var(--line-soft);
  color: var(--muted); border-radius: 999px; padding: 2px 8px; }
.notice { margin-top: 12px; border: 1px dashed color-mix(in srgb, var(--muted) 55%, transparent); border-radius: var(--radius);
  padding: 16px; color: var(--fg-2); background: var(--card); font-size: 13.5px; }
.notice code, p.foot code { font-family: var(--mono); font-size: 12px; background: var(--bg-soft); border: 1px solid var(--line-soft); border-radius: 6px; padding: 1px 6px; }
p.foot { color: var(--muted); font-size: 12.5px; margin: 18px 2px 0; }
.empty-chart { margin: auto; color: var(--muted); font-size: 13px; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } .card::after, body::before { display: none; } }
</style>
</head>
<body>
<div class="topbar"><div class="topbar-inner">
  <div class="brand">
    <div class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></div>
    <div><h1>ccusage <span>dashboard</span></h1><div class="meta" id="meta">loading</div></div>
  </div>
  <div class="top-actions">
    <span class="live" id="live"><i></i><span id="live-text">snapshot</span></span>
    <div class="menuwrap">
      <button class="iconbtn" id="layout-btn" type="button" aria-label="Layout options" title="Layout options" aria-haspopup="true" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2.2"/></svg>
      </button>
      <div class="menu" id="layout-menu" hidden>
        <h3>Width</h3>
        <div class="row" id="opt-width">
          <button type="button" data-val="comfort">Comfort</button>
          <button type="button" data-val="wide">Wide</button>
          <button type="button" data-val="full">Full</button>
        </div>
        <h3>Cards per row</h3>
        <div class="row" id="opt-cards">
          <button type="button" data-val="auto">Auto</button>
          <button type="button" data-val="4">4</button>
          <button type="button" data-val="2">2</button>
        </div>
        <h3>Charts</h3>
        <div class="row" id="opt-charts">
          <button type="button" data-val="side">Side by side</button>
          <button type="button" data-val="stacked">Stacked</button>
          <button type="button" data-val="columns">Equal</button>
        </div>
        <h3>Density</h3>
        <div class="row" id="opt-density">
          <button type="button" data-val="comfort">Comfort</button>
          <button type="button" data-val="compact">Compact</button>
        </div>
        <h3>Sections</h3>
        <div class="row" id="opt-sections">
          <button type="button" data-val="charts">Charts</button>
          <button type="button" data-val="daily">Daily</button>
          <button type="button" data-val="monthly">Monthly</button>
          <button type="button" data-val="sessions">Sessions</button>
        </div>
      </div>
    </div>
    <button class="iconbtn" id="theme" type="button" aria-label="Toggle theme" title="Toggle theme">
      <svg id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
    </button>
  </div>
</div></div>
<div class="wrap">
  <div class="controls">
    <span class="label">Source</span>
    <div class="seg" id="sources" role="group" aria-label="sources"></div>
    <span class="label">Days</span>
    <div class="seg" id="ranges" role="group" aria-label="day range">
      <button type="button" data-val="7">7D</button>
      <button type="button" data-val="30">30D</button>
      <button type="button" data-val="90">90D</button>
      <button type="button" data-val="all">All</button>
    </div>
    <span class="label">Months</span>
    <div class="seg" id="mranges" role="group" aria-label="month range">
      <button type="button" data-val="3">3M</button>
      <button type="button" data-val="6">6M</button>
      <button type="button" data-val="12">12M</button>
      <button type="button" data-val="all">All</button>
    </div>
    <span class="range-note" id="range-note"></span>
  </div>
  <div class="cards" id="cards"></div>
  <div id="empty"></div>
  <div class="grid2" id="sec-charts">
    <div class="panel">
      <div class="panel-head"><h2>Daily tokens</h2><span class="hint" id="hint-daily">last 30 days</span><span class="total" id="tot-daily"></span></div>
      <div class="legend"><span><span class="dot" style="background:#6366f1"></span>total tokens</span><span><span class="dot" style="background:var(--muted)"></span>hover a bar for exact values</span></div>
      <div class="chart" id="chart-daily" role="img" aria-label="Daily tokens chart"></div>
      <div class="xlabels" id="x-daily"></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Monthly cost</h2><span class="hint" id="hint-monthly">last 12 months</span><span class="total" id="tot-monthly"></span></div>
      <div class="legend"><span><span class="dot" style="background:#06b6d4"></span>cost in USD</span></div>
      <div class="chart" id="chart-monthly" role="img" aria-label="Monthly cost chart"></div>
      <div class="xlabels" id="x-monthly"></div>
    </div>
  </div>
  <section class="block panel" id="sec-daily">
    <div class="panel-head"><h2>Daily history</h2><span class="count" id="c-daily"></span></div>
    <div class="tbl-wrap"><table id="tbl-daily"></table></div>
  </section>
  <section class="block panel" id="sec-monthly">
    <div class="panel-head"><h2>Monthly history</h2><span class="count" id="c-monthly"></span></div>
    <div class="tbl-wrap"><table id="tbl-monthly"></table></div>
  </section>
  <section class="block panel" id="sec-sessions">
    <div class="panel-head"><h2>Recent sessions</h2><span class="count" id="c-sessions"></span></div>
    <div class="tbl-wrap"><table id="tbl-sessions"></table></div>
  </section>
  <p class="foot">Snapshot file. Rerun <code>ccusage-dash</code> to refresh. Pricing comes from ccusage.</p>
</div>
<script src="./data.js"></script>
<script>
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("ccusage-theme"); } catch (e) {}
  function syncIcon() {
    var dark = root.getAttribute("data-theme") === "dark";
    document.getElementById("icon-sun").style.display = dark ? "none" : "";
    document.getElementById("icon-moon").style.display = dark ? "" : "none";
  }
  function apply(t) { if (t) root.setAttribute("data-theme", t); else root.removeAttribute("data-theme"); syncIcon(); }
  if (saved) apply(saved);
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) apply("dark");
  else apply("light");
  syncIcon();
  document.getElementById("theme").onclick = function () {
    var cur = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(cur);
    try { localStorage.setItem("ccusage-theme", cur); } catch (e) {}
  };
  var layout = { width: "comfort", cards: "auto", charts: "side", density: "comfort", show: { charts: true, daily: true, monthly: true, sessions: true } };
  try {
    var raw = localStorage.getItem("ccusage-layout");
    if (raw) { var p = JSON.parse(raw); for (var k in p) layout[k] = p[k]; }
  } catch (e) {}
  function saveLayout() { try { localStorage.setItem("ccusage-layout", JSON.stringify(layout)); } catch (e) {} }
  function syncMenu() {
    function sync(id, val) {
      var btns = document.querySelectorAll("#" + id + " button");
      btns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-val") === val ? "true" : "false"); });
    }
    sync("opt-width", layout.width); sync("opt-cards", layout.cards);
    sync("opt-charts", layout.charts); sync("opt-density", layout.density);
    var sb = document.querySelectorAll("#opt-sections button");
    sb.forEach(function (b) {
      var v = b.getAttribute("data-val");
      b.setAttribute("aria-pressed", layout.show[v] ? "true" : "false");
    });
  }
  function applyLayout() {
    root.setAttribute("data-width", layout.width);
    root.setAttribute("data-cards", layout.cards);
    root.setAttribute("data-charts", layout.charts);
    root.setAttribute("data-density", layout.density);
    var map = { charts: "sec-charts", daily: "sec-daily", monthly: "sec-monthly", sessions: "sec-sessions" };
    for (var key in map) {
      var el = document.getElementById(map[key]);
      if (el) { if (layout.show[key]) el.removeAttribute("hidden"); else el.setAttribute("hidden", ""); }
    }
    syncMenu(); saveLayout();
  }
  function bindOpt(id, fn) {
    var btns = document.querySelectorAll("#" + id + " button");
    btns.forEach(function (b) {
      b.onclick = function () { fn(b.getAttribute("data-val")); applyLayout(); };
    });
  }
  bindOpt("opt-width", function (v) { layout.width = v; });
  bindOpt("opt-cards", function (v) { layout.cards = v; });
  bindOpt("opt-charts", function (v) { layout.charts = v; });
  bindOpt("opt-density", function (v) { layout.density = v; });
  bindOpt("opt-sections", function (v) { layout.show[v] = !layout.show[v]; });
  applyLayout();
  var menu = document.getElementById("layout-menu");
  var lbtn = document.getElementById("layout-btn");
  lbtn.onclick = function (e) {
    e.stopPropagation();
    var open = menu.hasAttribute("hidden");
    if (open) { menu.removeAttribute("hidden"); lbtn.setAttribute("aria-expanded", "true"); }
    else { menu.setAttribute("hidden", ""); lbtn.setAttribute("aria-expanded", "false"); }
  };
  document.addEventListener("click", function (e) {
    if (!menu.hasAttribute("hidden") && !menu.contains(e.target) && e.target !== lbtn && !lbtn.contains(e.target)) {
      menu.setAttribute("hidden", ""); lbtn.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hasAttribute("hidden")) { menu.setAttribute("hidden", ""); lbtn.setAttribute("aria-expanded", "false"); lbtn.focus(); }
  });
  var D = window.__CCUSAGE__ || null;
  var meta = document.getElementById("meta");
  if (!D) { meta.textContent = "no data found next to this file"; return; }
  var gen = D.generatedAt ? new Date(D.generatedAt).toLocaleString() : "";
  meta.textContent = "snapshot " + gen + (D.ccusageAvailable ? "" : " - ccusage missing");
  try { document.getElementById("live-text").textContent = gen || "snapshot"; } catch (e) {}
  var active = "all";
  var dayRange = "30";
  var monthRange = "12";
  try {
    var fraw = localStorage.getItem("ccusage-filters");
    if (fraw) { var fp = JSON.parse(fraw); if (fp.dayRange) dayRange = fp.dayRange; if (fp.monthRange) monthRange = fp.monthRange; }
  } catch (e) {}
  function saveFilters() { try { localStorage.setItem("ccusage-filters", JSON.stringify({ dayRange: dayRange, monthRange: monthRange })); } catch (e) {} }
  function discoverSources() {
    var seen = {};
    var out = [];
    function add(s) { s = String(s || "").trim(); if (s && !seen[s]) { seen[s] = 1; out.push(s); } }
    (D.sources || []).forEach(add);
    ["daily", "monthly", "sessions"].forEach(function (k) {
      (D[k] || []).forEach(function (r) {
        (r.agents || []).forEach(add);
        (r.byAgent || []).forEach(function (a) { add(a.agent); });
      });
    });
    return ["all"].concat(out);
  }
  var srcWrap = document.getElementById("sources");
  discoverSources().forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = s; b.setAttribute("aria-pressed", s === active ? "true" : "false");
    b.onclick = function () { active = s; paint(); };
    srcWrap.appendChild(b);
  });
  function syncRanges() {
    document.querySelectorAll("#ranges button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-val") === dayRange ? "true" : "false");
    });
    document.querySelectorAll("#mranges button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-val") === monthRange ? "true" : "false");
    });
  }
  document.querySelectorAll("#ranges button").forEach(function (b) {
    b.onclick = function () { dayRange = b.getAttribute("data-val"); saveFilters(); paint(); };
  });
  document.querySelectorAll("#mranges button").forEach(function (b) {
    b.onclick = function () { monthRange = b.getAttribute("data-val"); saveFilters(); paint(); };
  });
  function applyRange(rows, range) {
    if (range === "all") return rows;
    var n = parseInt(range, 10);
    if (!isFinite(n) || n <= 0) return rows;
    return rows.slice(-n);
  }
  syncRanges();
  function money(n) { return "$" + Number(n || 0).toFixed(2); }
  function num(n) { return Number(n || 0).toLocaleString("en-US"); }
  function compact(n) {
    n = Number(n || 0);
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
    return String(n);
  }
  function shortPeriod(p) { return String(p || "").slice(5) || String(p || ""); }
  function inSource(row) {
    if (active === "all") return true;
    if (row.byAgent && row.byAgent.length) return row.byAgent.some(function (a) { return a.agent === active; });
    return (row.agents || []).indexOf(active) !== -1;
  }
  function sliceFor(row) {
    if (active === "all" || !row.byAgent || !row.byAgent.length) return row;
    var f = row.byAgent.filter(function (a) { return a.agent === active; })[0];
    if (!f) return null;
    return { period: row.period, inputTokens: f.inputTokens, outputTokens: f.outputTokens, cacheReadTokens: f.cacheReadTokens || 0, totalTokens: f.totalTokens, totalCost: f.totalCost, modelsUsed: f.modelsUsed || [] };
  }
  var ICONS = {
    cost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    tok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    sum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>'
  };
  function paint() {
    var chips = srcWrap.querySelectorAll("button");
    chips.forEach(function (c) { c.setAttribute("aria-pressed", c.textContent === active ? "true" : "false"); });
    syncRanges();
    var fDaily = (D.daily || []).filter(inSource).map(sliceFor).filter(Boolean);
    var fMonthly = (D.monthly || []).filter(inSource).map(sliceFor).filter(Boolean);
    var daily = applyRange(fDaily, dayRange);
    var monthly = applyRange(fMonthly, monthRange);
    var today = daily[daily.length - 1];
    var month = monthly[monthly.length - 1];
    var totCost = daily.reduce(function (n, d) { return n + (d.totalCost || 0); }, 0);
    var totTok = daily.reduce(function (n, d) { return n + (d.totalTokens || 0); }, 0);
    var cards = document.getElementById("cards");
    cards.innerHTML = "";
    [["Today cost", today ? money(today.totalCost) : "-", today ? today.period : active, ICONS.cost, "g1", today ? num(today.totalTokens) + " tokens today" : "no rows"],
     ["Today tokens", today ? compact(today.totalTokens) : "-", today ? num(today.inputTokens) + " in / " + num(today.outputTokens) + " out" : "no rows", ICONS.tok, "g2", today ? today.period : ""],
     ["Month cost", month ? money(month.totalCost) : "-", month ? month.period : active, ICONS.cal, "g3", month ? compact(month.totalTokens) + " tokens" : ""],
     ["Period total", money(totCost), compact(totTok) + " tokens in range", ICONS.sum, "g4", daily.length + " days"]
    ].forEach(function (c) {
      var el = document.createElement("div"); el.className = "card";
      el.innerHTML = '<div class="card-top"><span class="glyph ' + c[4] + '"></span><span class="k"></span></div><div class="v"></div><div class="s"></div><div class="s" style="opacity:.75"></div>';
      el.children[0].children[0].innerHTML = c[3];
      el.children[0].children[1].textContent = c[0];
      el.children[1].textContent = c[1]; el.children[1].title = c[1];
      el.children[2].textContent = c[2]; el.children[2].title = c[2];
      el.children[3].textContent = c[5] || "";
      cards.appendChild(el);
    });
    var empty = document.getElementById("empty");
    if (!D.ccusageAvailable) {
      empty.innerHTML = '<div class="notice">ccusage data is missing. Install it with <code>npm i -g ccusage</code> or <code>bun add -g ccusage</code>, run an agent once, then rerun <code>ccusage-dash</code>. ' + (D.ccusageError ? "Detail: " + D.ccusageError : "") + '</div>';
    } else if (!daily.length) {
      empty.innerHTML = '<div class="notice">No usage rows for this filter. Try <code>all</code> or a wider day range, or check that your agents have written local session files.</div>';
    } else empty.innerHTML = "";
    var rn = document.getElementById("range-note");
    if (daily.length) {
      var span = daily[0].period + " to " + daily[daily.length - 1].period + " - " + daily.length + " days";
      rn.textContent = fDaily.length > daily.length ? span + " (" + fDaily.length + " total)" : span;
    }
    else rn.textContent = "";
    document.getElementById("hint-daily").textContent = dayRange === "all" ? "all " + fDaily.length + " days" : "last " + daily.length + " days";
    document.getElementById("hint-monthly").textContent = monthRange === "all" ? "all " + fMonthly.length + " months" : "last " + monthly.length + " months";
    document.getElementById("tot-daily").textContent = compact(totTok) + " tok";
    document.getElementById("tot-monthly").textContent = money(monthly.reduce(function (n, d) { return n + (d.totalCost || 0); }, 0));
    bars(document.getElementById("chart-daily"), document.getElementById("x-daily"), daily, "totalTokens", false);
    bars(document.getElementById("chart-monthly"), document.getElementById("x-monthly"), monthly, "totalCost", true);
    document.getElementById("c-daily").textContent = fDaily.length > daily.length ? daily.length + " of " + fDaily.length + " rows" : daily.length + " rows";
    document.getElementById("c-monthly").textContent = fMonthly.length > monthly.length ? monthly.length + " of " + fMonthly.length + " rows" : monthly.length + " rows";
    document.getElementById("c-sessions").textContent = (D.sessions || []).length + " in range";
    table(document.getElementById("tbl-daily"), daily.slice().reverse().slice(0, 90), true);
    table(document.getElementById("tbl-monthly"), monthly.slice().reverse().slice(0, 24), true);
    stable(document.getElementById("tbl-sessions"), (D.sessions || []).slice(0, 20));
  }
  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var m = v / p;
    var nm = m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10;
    return nm * p;
  }
  function bars(el, xel, rows, key, isCost) {
    el.innerHTML = "";
    el.querySelectorAll(".yaxis").forEach(function (n) { n.remove(); });
    if (!rows.length) { el.innerHTML = '<span class="empty-chart">No data for this filter</span>'; xel.textContent = ""; return; }
    var max = niceMax(Math.max.apply(null, rows.map(function (r) { return r[key] || 0; }).concat([1])));
    var y = document.createElement("div"); y.className = "yaxis";
    [max, max / 2, 0].forEach(function (v) {
      var s = document.createElement("span");
      s.textContent = isCost ? "$" + (v >= 100 ? Math.round(v) : v.toFixed(v < 10 ? 1 : 0)) : compact(v);
      y.appendChild(s);
    });
    el.appendChild(y);
    rows.forEach(function (r, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "bar" + (isCost ? " cost" : "") + (i === rows.length - 1 ? " today" : "");
      d.style.height = Math.max(4, Math.round((r[key] || 0) / max * 132)) + "px";
      d.style.flexGrow = "1";
      var label = r.period + "  " + (isCost ? money(r[key]) : num(r[key]) + " tokens");
      d.setAttribute("aria-label", label);
      d.setAttribute("title", label);
      d.innerHTML = '<span class="tip"></span>';
      d.children[0].textContent = label;
      el.appendChild(d);
    });
    xel.innerHTML = "";
    var a = document.createElement("span"); a.textContent = shortPeriod(rows[0].period);
    var b = document.createElement("span"); b.textContent = shortPeriod(rows[rows.length - 1].period);
    xel.appendChild(a); xel.appendChild(b);
  }
  function modelPills(list) {
    list = (list || []).slice(0, 4);
    if (!list.length) return '<span style="color:var(--muted)">-</span>';
    return list.map(function (m) {
      var s = String(m);
      var short = s.length > 34 ? s.slice(0, 32) + ".." : s;
      return '<span class="pill" title="' + s.replace(/"/g, "&quot;") + '">' + short.replace(/</g, "&lt;") + "</span>";
    }).join("");
  }
  function table(el, rows, showModels) {
    if (!rows.length) { el.innerHTML = "<tr><td>no data</td></tr>"; return; }
    var h = "<thead><tr><th>period</th><th>input</th><th>output</th><th>cache read</th><th>total</th><th>cost</th>" + (showModels ? "<th style='text-align:left'>models</th>" : "") + "</tr></thead><tbody>";
    el.innerHTML = h + rows.map(function (r) {
      return "<tr><td class='period'>" + r.period + "</td><td class='num'>" + num(r.inputTokens) + "</td><td class='num'>" + num(r.outputTokens) + "</td><td class='num'>" + num(r.cacheReadTokens) + "</td><td class='num'>" + num(r.totalTokens) + "</td><td class='cost'>" + money(r.totalCost) + "</td>" + (showModels ? "<td style='text-align:left'>" + modelPills(r.modelsUsed || r.models) + "</td>" : "") + "</tr>";
    }).join("") + "</tbody>";
  }
  function stable(el, rows) {
    if (!rows.length) { el.innerHTML = "<tr><td>no sessions in range</td></tr>"; return; }
    el.innerHTML = "<thead><tr><th style='text-align:left'>session</th><th>tokens</th><th>cost</th><th style='text-align:left'>models</th></tr></thead><tbody>" + rows.map(function (r) {
      var id = String(r.sessionId || r.period || "?");
      var short = id.length > 12 ? id.slice(0, 8) + ".." : id;
      return "<tr><td class='period' style='text-align:left' title='" + id.replace(/"/g, "&quot;") + "'>" + short.replace(/</g, "&lt;") + "</td><td class='num'>" + num(r.totalTokens) + "</td><td class='cost'>" + money(r.totalCost) + "</td><td style='text-align:left'>" + modelPills(r.modelsUsed) + "</td></tr>";
    }).join("") + "</tbody>";
  }
  paint();
})();
</script>
</body>
</html>`;
}
