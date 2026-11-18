import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface AuditMetadata {
  vulnerabilities?: {
    info?: number;
    low?: number;
    moderate?: number;
    high?: number;
    critical?: number;
  };
}

interface PnpmAuditReport {
  metadata?: AuditMetadata;
  advisories?: Record<string, unknown>;
  error?: unknown;
}

function parseReportArg(argv: string[]): string {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv.at(i) === "--report") {
      const value = argv.at(i + 1);
      if (!value) {
        throw new Error("Missing path after --report.");
      }
      return value;
    }
  }
  return "reports/security/sca-audit.json";
}

function resolveReportPath(rawPath: string): string {
  const repoRoot = process.cwd();
  const resolved = path.resolve(repoRoot, rawPath);
  const reportsRoot = path.resolve(repoRoot, "reports");
  const relative = path.relative(reportsRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Report path must reside inside reports/: ${rawPath}`);
  }
  return resolved;
}

function runPnpmAudit(): { status: number; stdout: string; stderr: string } {
  const args = ["pnpm", "audit", "--audit-level=high", "--json"];
  if (process.platform === "win32") {
    const corepackJs = path.join(
      path.dirname(process.execPath),
      "node_modules",
      "corepack",
      "dist",
      "corepack.js",
    );
    if (fs.existsSync(corepackJs)) {
      const result = spawnSync(process.execPath, [corepackJs, ...args], {
        encoding: "utf8",
        shell: false,
      });
      return {
        status: result.status ?? 1,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
      };
    }
  }

  const result = spawnSync("corepack", args, {
    encoding: "utf8",
    shell: false,
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function main(): void {
  const rawReportPath = parseReportArg(process.argv.slice(2));
  const reportPath = resolveReportPath(rawReportPath);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  const auditResult = runPnpmAudit();
  let parsed: PnpmAuditReport | null = null;
  let parseError: string | null = null;

  if (auditResult.stdout.trim().length > 0) {
    try {
      parsed = JSON.parse(auditResult.stdout) as PnpmAuditReport;
    } catch (error) {
      parseError = error instanceof Error ? error.message : String(error);
    }
  } else {
    parseError = "Empty JSON stdout from pnpm audit.";
  }

  const vulnerabilities = parsed?.metadata?.vulnerabilities;
  const highCount = vulnerabilities?.high ?? null;
  const criticalCount = vulnerabilities?.critical ?? null;

  const passed =
    auditResult.status === 0 &&
    parseError === null &&
    parsed !== null &&
    !parsed.error &&
    highCount === 0 &&
    criticalCount === 0;

  const output = {
    tool: "pnpm-audit",
    auditLevel: "high",
    timestampUtc: new Date().toISOString(),
    status: passed ? "PASS" : "FAIL",
    exitCode: auditResult.status,
    vulnerabilities: vulnerabilities ?? null,
    parseError,
    stderr: auditResult.stderr.trim() || null,
    rawReport: parsed,
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  if (!passed) {
    process.stderr.write(
      `[SCA] FAIL (exit=${auditResult.status}, high=${String(highCount)}, critical=${String(criticalCount)}) -> ${rawReportPath}\n`,
    );
    process.exit(1);
  }

  process.stdout.write(
    `[SCA] PASS (high=0, critical=0, moderate=${String(vulnerabilities?.moderate ?? 0)}, low=${String(vulnerabilities?.low ?? 0)}) -> ${rawReportPath}\n`,
  );
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[SCA] error=${message}\n`);
  process.exit(1);
}
