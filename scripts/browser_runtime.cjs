// Optional browser-check dependencies, resolved from the frontend installation.
const { existsSync } = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

const root = path.resolve(__dirname, "..");
const frontendRequire = createRequire(path.join(root, "erd_frontend/package.json"));
const python = process.env.PYTHON_EXECUTABLE ||
  (process.platform === "win32"
    ? path.join(root, ".venv/Scripts/python.exe")
    : path.join(root, ".venv/bin/python"));

module.exports = {
  get chromium() {
    return frontendRequire(process.env.PLAYWRIGHT_MODULE || "playwright").chromium;
  },
  python: existsSync(python) || process.env.PYTHON_EXECUTABLE
    ? python
    : process.platform === "win32" ? "python" : "python3",
  browserOptions: {
    headless: true,
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
  },
};
