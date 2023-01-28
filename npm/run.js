#!/usr/bin/env node

const { generateBinPath } = require("./node-platform");

try {
  const { binPath } = generateBinPath();
  require("child_process").execFileSync(binPath, process.argv.slice(2), {
    stdio: "inherit",
  });
} catch (e) {
  if (e && e.status) process.exit(e.status);
  throw e;
}
