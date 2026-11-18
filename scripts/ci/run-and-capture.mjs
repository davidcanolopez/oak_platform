import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  let outPath = "";
  let separatorIndex = argv.indexOf("--");
  if (separatorIndex === -1) {
    throw new Error("Missing '--' separator before command.");
  }

  const ownArgs = argv.slice(0, separatorIndex);
  const cmdArgs = argv.slice(separatorIndex + 1);

  for (let i = 0; i < ownArgs.length; i += 1) {
    const arg = ownArgs.at(i);
    if (arg === "--out") {
      const value = ownArgs.at(i + 1);
      if (!value) {
        throw new Error("Missing path after --out.");
      }
      outPath = value;
      i += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!outPath) {
    throw new Error("Option --out <path> is required.");
  }
  if (cmdArgs.length === 0) {
    throw new Error("Missing command after '--'.");
  }

  return { outPath, command: cmdArgs[0], args: cmdArgs.slice(1) };
}

function resolveReportPath(rawPath) {
  const repoRoot = process.cwd();
  const resolved = path.resolve(repoRoot, rawPath);
  const reportsRoot = path.resolve(repoRoot, "reports");
  const relative = path.relative(reportsRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Output path must reside inside reports/: ${rawPath}`);
  }
  return resolved;
}

function resolveExecutable(command, args) {
  if (command === "corepack" && process.platform === "win32") {
    const corepackJs = path.join(
      path.dirname(process.execPath),
      "node_modules",
      "corepack",
      "dist",
      "corepack.js",
    );
    if (fs.existsSync(corepackJs)) {
      return { execPath: process.execPath, execArgs: [corepackJs, ...args] };
    }
  }
  return { execPath: command, execArgs: args };
}

function main() {
  const { outPath, command, args } = parseArgs(process.argv.slice(2));
  const resolvedOut = resolveReportPath(outPath);
  fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });

  const logStream = fs.createWriteStream(resolvedOut, { flags: "w", encoding: "utf8" });
  const { execPath, execArgs } = resolveExecutable(command, args);

  const startedAt = new Date().toISOString();
  logStream.write(`[run-and-capture] started_at_utc=${startedAt}\n`);
  logStream.write(`[run-and-capture] command=${[command, ...args].join(" ")}\n`);

  const child = spawn(execPath, execArgs, {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    logStream.write(chunk);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
    logStream.write(chunk);
  });

  child.on("error", (err) => {
    const msg = `[run-and-capture] spawn_error=${err.message}\n`;
    process.stderr.write(msg);
    logStream.write(msg);
    logStream.end(() => {
      process.exit(1);
    });
  });

  child.on("close", (code, signal) => {
    const exitCode = typeof code === "number" ? code : 1;
    const finishedAt = new Date().toISOString();
    logStream.write(
      `\n[run-and-capture] finished_at_utc=${finishedAt} exit_code=${exitCode} signal=${signal ?? "none"}\n`,
    );
    logStream.end(() => {
      process.exit(exitCode);
    });
  });
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[run-and-capture] error=${message}\n`);
  process.exit(1);
}
