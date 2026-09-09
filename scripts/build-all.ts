const targets = ["bun-linux-x64", "bun-linux-arm64", "bun-darwin-arm64", "bun-darwin-x64"] as const;
for (const t of targets) {
  console.log(`building ${t}`);
  const r = Bun.spawnSync(["bun", "build", "--compile", "src/cli.ts", "--outfile", `dist/ccusage-dash-${t}`, "--target", t], { stdout: "inherit", stderr: "inherit" });
  if (r.exitCode !== 0) process.exit(r.exitCode);
}
