import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  let token = "";
  let phase = "";
  let report = "";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv.at(i);
    const value = argv.at(i + 1);
    if (arg === "--token" && value) {
      token = value;
      i += 1;
    } else if (arg === "--phase" && value) {
      phase = value;
      i += 1;
    } else if (arg === "--report" && value) {
      report = value;
      i += 1;
    } else {
      throw new Error(`Invalid or incomplete argument: ${arg}`);
    }
  }

  if (!token || !phase || !report) {
    throw new Error("Required options: --token <TOKEN> --phase <PHASE> --report <PATH>");
  }

  return { token, phase, report };
}

function resolveReportPath(rawPath) {
  const repoRoot = process.cwd();
  const resolved = path.resolve(repoRoot, rawPath);
  const reportsRoot = path.resolve(repoRoot, "reports");
  const relative = path.relative(reportsRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Report path must reside inside reports/: ${rawPath}`);
  }
  return resolved;
}

function main() {
  const { token, phase, report } = parseArgs(process.argv.slice(2));
  const resolvedReport = resolveReportPath(report);
  fs.mkdirSync(path.dirname(resolvedReport), { recursive: true });

  const payload = {
    token,
    phase,
    status: "FAIL_CLOSED_NOT_IMPLEMENTED",
    exitCode: 2,
    reason: `Gate command '${token}' is intentionally fail-closed until implemented in ${phase}.`,
    timestampUtc: new Date().toISOString(),
  };

  fs.writeFileSync(resolvedReport, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  process.stderr.write(
    `[FAIL-CLOSED] ${token} (${phase}): FAIL_CLOSED_NOT_IMPLEMENTED -> ${report}\n`,
  );
  process.exit(2);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[FAIL-CLOSED] error=${message}\n`);
  process.exit(2);
}
