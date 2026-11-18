import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { runSecretLint } from "secretlint";

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".woff2",
  ".ico",
  ".docx",
  ".xlsx",
  ".pdf",
]);

const RESERVED_EMAIL_SUFFIXES = [
  ".invalid",
  ".example",
  ".test",
  ".example.com",
  ".example.org",
  ".example.net",
  ".localhost",
];

const OAK_PATTERNS = [
  {
    ruleId: "oak/private-key",
    message: "Private key PEM header detected.",
    regex: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/g,
  },
  {
    ruleId: "oak/stripe-live-key",
    message: "Live Stripe key pattern detected.",
    regex: /\b(?:sk|pk|rk)_live_[A-Za-z0-9]{8,}\b/g,
  },
  {
    ruleId: "oak/stripe-test-or-webhook-key",
    message: "Stripe test or webhook secret literal detected.",
    regex: /\b(?:sk_test|rk_test|whsec)_[A-Za-z0-9]{8,}\b/g,
  },
  {
    ruleId: "oak/resend-token",
    message: "Resend API token literal detected.",
    regex: /\bre_[A-Za-z0-9_]{16,}\b/g,
  },
  {
    ruleId: "oak/supabase-pat",
    message: "Supabase personal access token literal detected.",
    regex: /\bsbp_[A-Za-z0-9]{16,}\b/g,
  },
  {
    ruleId: "oak/jwt-token",
    message: "Hardcoded JWT token literal detected.",
    regex: /\beyJ[A-Za-z0-9_-]{12,}\.eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\b/g,
  },
  {
    ruleId: "oak/postgres-credentials",
    message: "PostgreSQL URI with non-local credentials detected.",
    regex:
      /postgres(?:ql)?:\/\/[^:\s/]+:[^@\s"'`<>]+@(?!(?:localhost|127\.0\.0\.1|postgres)\b)[^\s"'`]+/gi,
  },
];

const EMAIL_REGEX = /(?<![/\w.-])[A-Za-z0-9._%+-]+@(?!\d+\.\d+)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

function parseArgs(argv) {
  let reportPath = "reports/security/secret-scan.json";
  const extraFiles = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv.at(i);
    const next = argv.at(i + 1);
    if (arg === "--report" && next) {
      reportPath = next;
      i += 1;
    } else if (arg === "--extra-file" && next) {
      extraFiles.push(next);
      i += 1;
    } else {
      throw new Error(`Invalid argument: ${String(arg)}`);
    }
  }

  return { reportPath, extraFiles };
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

function listCandidateFiles(repoRoot, extraFiles) {
  const rawBuffer = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    { cwd: repoRoot },
  );

  const trackedAndNew = rawBuffer
    .toString("utf8")
    .split("\0")
    .filter((entry) => entry.length > 0)
    .map((entry) => path.resolve(repoRoot, entry));

  const extraResolved = extraFiles.map((entry) => path.resolve(repoRoot, entry));
  const uniquePaths = Array.from(new Set([...trackedAndNew, ...extraResolved]));

  return uniquePaths.filter((absPath) => {
    const ext = path.extname(absPath).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) {
      return false;
    }
    return fs.existsSync(absPath) && fs.statSync(absPath).isFile();
  });
}

function scanWithOakRules(absPath, repoRoot) {
  const content = fs.readFileSync(absPath, "utf8");
  const lines = content.split(/\r?\n/);
  const relPath = path.relative(repoRoot, absPath) || absPath;
  const findings = [];

  for (let idx = 0; idx < lines.length; idx += 1) {
    const lineText = lines.at(idx) ?? "";
    const lineNumber = idx + 1;

    for (const pattern of OAK_PATTERNS) {
      pattern.regex.lastIndex = 0;
      if (pattern.regex.test(lineText)) {
        findings.push({
          file: relPath,
          line: lineNumber,
          ruleId: pattern.ruleId,
          message: pattern.message,
        });
      }
    }

    if (path.basename(absPath) === "pnpm-lock.yaml") {
      continue;
    }
    EMAIL_REGEX.lastIndex = 0;
    const emailMatches = lineText.match(EMAIL_REGEX);
    if (emailMatches) {
      for (const email of emailMatches) {
        const lower = email.toLowerCase();
        const isReserved = RESERVED_EMAIL_SUFFIXES.some((suffix) => lower.endsWith(suffix));
        if (!isReserved) {
          findings.push({
            file: relPath,
            line: lineNumber,
            ruleId: "oak/non-reserved-email",
            message: "Non-RFC2606 email address detected outside reserved domains.",
          });
        }
      }
    }
  }

  return findings;
}

async function runSecretlintChecks(files, repoRoot) {
  const insideRepoFiles = [];
  const outsideRepoFiles = [];

  for (const absPath of files) {
    const rel = path.relative(repoRoot, absPath);
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
      outsideRepoFiles.push(absPath);
    } else {
      insideRepoFiles.push(rel);
    }
  }

  const engineOptions = {
    cwd: repoRoot,
    formatter: "json",
    color: false,
    terminalLink: false,
    maskSecrets: true,
    configFileJSON: {
      rules: [{ id: "@secretlint/secretlint-rule-preset-recommend" }],
    },
  };

  const parsedReports = [];
  let hasFindings = false;

  if (insideRepoFiles.length > 0) {
    const res = await runSecretLint({
      cliOptions: {
        cwd: repoRoot,
        filePathOrGlobList: insideRepoFiles,
        noGlob: true,
        respectGitignore: false,
      },
      engineOptions,
    });

    if (res.exitStatus !== 0) {
      hasFindings = true;
    }
    if (res.stdout) {
      const jsonOutput = JSON.parse(res.stdout);
      for (const fileEntry of jsonOutput) {
        if (Array.isArray(fileEntry.messages) && fileEntry.messages.length > 0) {
          hasFindings = true;
          parsedReports.push({
            filePath: path.relative(repoRoot, fileEntry.filePath),
            messages: fileEntry.messages.map((msg) => ({
              ruleId: msg.ruleId,
              messageId: msg.messageId,
              line: msg.loc?.start?.line ?? null,
              severity: msg.severity,
            })),
          });
        }
      }
    }
  }

  for (const absPath of outsideRepoFiles) {
    const stdinContent = fs.readFileSync(absPath, "utf8");
    const res = await runSecretLint({
      cliOptions: {
        cwd: repoRoot,
        stdinContent,
        stdinFileName: path.basename(absPath),
      },
      engineOptions,
    });
    if (res.exitStatus !== 0) {
      hasFindings = true;
    }
    if (res.stdout) {
      const jsonOutput = JSON.parse(res.stdout);
      for (const fileEntry of jsonOutput) {
        if (Array.isArray(fileEntry.messages) && fileEntry.messages.length > 0) {
          hasFindings = true;
          parsedReports.push({
            filePath: absPath,
            messages: fileEntry.messages.map((msg) => ({
              ruleId: msg.ruleId,
              messageId: msg.messageId,
              line: msg.loc?.start?.line ?? null,
              severity: msg.severity,
            })),
          });
        }
      }
    }
  }

  return { hasFindings, findings: parsedReports };
}

function runOptionalGitleaks(repoRoot) {
  const versionCheck = spawnSync("gitleaks", ["version"], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  });

  if (versionCheck.error && "code" in versionCheck.error && versionCheck.error.code === "ENOENT") {
    return {
      available: false,
      status: "NOT_INSTALLED_IN_LOCAL_PATH",
      exitCode: null,
      findingsCount: 0,
    };
  }

  const gitleaksReportPath = "reports/security/gitleaks.json";
  fs.mkdirSync(path.resolve(repoRoot, "reports/security"), { recursive: true });
  const detectResult = spawnSync(
    "gitleaks",
    [
      "detect",
      "--source",
      ".",
      "--no-banner",
      "--redact",
      "--report-format",
      "json",
      "--report-path",
      gitleaksReportPath,
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
      shell: false,
    },
  );

  let findingsCount = 0;
  const resolvedGitleaksReport = path.resolve(repoRoot, gitleaksReportPath);
  if (fs.existsSync(resolvedGitleaksReport)) {
    const parsed = JSON.parse(fs.readFileSync(resolvedGitleaksReport, "utf8"));
    findingsCount = Array.isArray(parsed) ? parsed.length : 0;
  }

  const exitCode = detectResult.status ?? 1;
  return {
    available: true,
    status: exitCode === 0 && findingsCount === 0 ? "PASS" : "FAIL",
    exitCode,
    findingsCount,
  };
}

async function main() {
  const repoRoot = process.cwd();
  const { reportPath, extraFiles } = parseArgs(process.argv.slice(2));
  const resolvedReport = resolveReportPath(reportPath);
  fs.mkdirSync(path.dirname(resolvedReport), { recursive: true });

  const candidateFiles = listCandidateFiles(repoRoot, extraFiles);
  const secretlintResult = await runSecretlintChecks(candidateFiles, repoRoot);

  const oakFindings = [];
  for (const absPath of candidateFiles) {
    oakFindings.push(...scanWithOakRules(absPath, repoRoot));
  }

  const gitleaks = runOptionalGitleaks(repoRoot);
  const gitleaksFailed = gitleaks.available && gitleaks.status !== "PASS";
  const passed = !secretlintResult.hasFindings && oakFindings.length === 0 && !gitleaksFailed;

  const report = {
    tool: "oak-secret-scan",
    engines: ["secretlint@14.0.1", "oak-deterministic-rules", "gitleaks-when-available"],
    timestampUtc: new Date().toISOString(),
    status: passed ? "PASS" : "FAIL",
    scannedFilesCount: candidateFiles.length,
    secretlintFindingsCount: secretlintResult.findings.length,
    secretlintFindings: secretlintResult.findings,
    oakFindingsCount: oakFindings.length,
    oakFindings,
    gitleaks,
  };

  fs.writeFileSync(resolvedReport, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (!passed) {
    process.stderr.write(
      `[SECRET_SCAN] FAIL (secretlint=${secretlintResult.findings.length}, oak=${oakFindings.length}, gitleaks=${gitleaks.status}) -> ${reportPath}\n`,
    );
    process.exit(1);
  }

  process.stdout.write(
    `[SECRET_SCAN] PASS (files=${candidateFiles.length}, findings=0, gitleaks=${gitleaks.status}) -> ${reportPath}\n`,
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[SECRET_SCAN] error=${message}\n`);
  process.exit(1);
});
