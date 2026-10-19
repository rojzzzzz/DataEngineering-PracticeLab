// Real Streamlit + shipped editor, with a disposable database and no user data.
const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const { chromium, python, browserOptions } = require("./browser_runtime.cjs");
const root = path.resolve(__dirname, "..");

(async () => {
  const tempRoot = path.join(root, "tmp");
  fs.mkdirSync(tempRoot, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(tempRoot, "verify-diagram-sql-"));
  const appPath = path.join(fixture, "app.py");
  fs.writeFileSync(appPath, `import os, sys\nfrom pathlib import Path\nsys.path.insert(0, ${JSON.stringify(root.replaceAll("\\", "/"))})\nimport streamlit as st\nst.set_page_config(layout="wide")\nfrom src.constructor_ui import render_diagram_maker\nrender_diagram_maker(Path(os.environ["SQL_DIAGRAM_TEST_DB"]))\n`);
  const port = await new Promise((resolve) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
  const child = spawn(python, [
    "-m", "streamlit", "run", appPath, "--server.address=127.0.0.1",
    `--server.port=${port}`, "--server.headless=true", "--server.fileWatcherType=none",
    "--browser.gatherUsageStats=false",
  ], { cwd: root, windowsHide: true, env: { ...process.env, SQL_DIAGRAM_TEST_DB: path.join(fixture, "test.db") } });
  let logs = "";
  child.stdout.on("data", (data) => { logs = (logs + data).slice(-12000); });
  child.stderr.on("data", (data) => { logs = (logs + data).slice(-12000); });
  let browser;
  let page;
  const deadline = setTimeout(() => { browser?.close(); child.kill(); }, 120000);
  try {
    const url = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 150; i++) {
      try { ready = (await fetch(url + "/_stcore/health")).ok; } catch {}
      if (ready) break;
      if (child.exitCode !== null) throw new Error(logs);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    if (!ready) throw new Error("Streamlit did not start: " + logs);
    browser = await chromium.launch(browserOptions);
    page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(20000);
    await page.goto(url);
    await page.getByRole("textbox", { name: "Diagram name", exact: true }).fill("SQL import verification");
    await page.getByRole("button", { name: "Create diagram", exact: true }).click();
    await page.locator(".erd-brand").waitFor();
    await page.getByText("Add tables from SQL", { exact: true }).click();
    const submit = async (sql) => {
      await page.getByRole("textbox", { name: "CREATE TABLE SQL", exact: true }).fill(sql);
      await page.getByRole("button", { name: "Add tables to diagram", exact: true }).click();
    };
    const waitCount = async (count) => {
      for (let i = 0; i < 100; i++) {
        if (await page.locator(".erd-node-heading strong").count() === count) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      assert.equal(await page.locator(".erd-node-heading strong").count(), count);
    };
    await submit("CREATE TABLE customers (id INTEGER PRIMARY KEY, name VARCHAR(120)); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), total DECIMAL(12,2));");
    await page.getByText("Added 2 tables to the diagram.", { exact: true }).waitFor();
    await page.getByText("Saved", { exact: true }).waitFor();
    assert.equal(await page.locator(".erd-node-heading strong").count(), 2);
    assert.match(await page.locator(".erd-node").filter({ hasText: "orders" }).innerText(), /FK/);
    // An import is a normal undoable structural edit, and redo saves it again.
    await page.getByRole("button", { name: "Undo", exact: true }).click();
    await waitCount(0);
    await page.getByRole("button", { name: "Redo", exact: true }).click();
    await page.locator(".erd-node-heading strong").filter({ hasText: "customers" }).waitFor();
    await page.getByText("Saved", { exact: true }).waitFor();
    // Skip an existing table with the requested shorthand; preserve its fields.
    await page.getByRole("textbox", { name: "CREATE TABLE SQL", exact: true }).fill("CREATE TABLE IF EXISTS customers (replacement TEXT); CREATE TABLE IF NOT EXISTS products (id BIGINT PRIMARY KEY);");
    await page.locator(".erd-list button").filter({ hasText: "customers" }).click();
    await page.getByRole("textbox", { name: "Entity annotation", exact: true }).fill("Local edit preserved during SQL import");
    await page.getByRole("button", { name: "Add tables to diagram", exact: true }).click();
    await page.getByText("Added 1 table to the diagram.", { exact: true }).waitFor();
    assert.equal(await page.locator(".erd-node-heading strong").count(), 3);
    assert.doesNotMatch(await page.locator(".erd-node").filter({ hasText: "customers" }).innerText(), /replacement/);
    // Reject the whole batch when a later table conflicts.
    await submit("CREATE TABLE discarded (id INT); CREATE TABLE customers (id INT);");
    await page.getByText(/Table customers already exists/).waitFor();
    assert.equal(await page.locator(".erd-node-heading strong").count(), 3);
    await submit("DROP TABLE customers;");
    await page.getByText("Only CREATE TABLE definitions with explicit columns are supported.", { exact: true }).waitFor();
    assert.equal(await page.locator(".erd-node-heading strong").count(), 3);
    await page.reload();
    await page.locator(".erd-node-heading strong").filter({ hasText: "products" }).waitFor();
    assert.equal(await page.locator(".erd-node-heading strong").count(), 3);
    const downloadReady = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download JSON", exact: true }).click();
    const download = await downloadReady;
    const content = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    assert.equal(content.diagram.entities.length, 3);
    assert.equal(content.diagram.entities.find((e) => e.name === "customers").fields[0].pk, true);
    assert.equal(content.diagram.entities.find((e) => e.name === "customers").annotation, "Local edit preserved during SQL import");
    await page.getByText("Add tables from SQL", { exact: true }).click();
    await page.screenshot({ path: path.join(tempRoot, "diagram-sql-browser.png"), fullPage: true });
    console.log("SQL Diagram Maker: real browser import, PK/FK, undo/redo, duplicate skip, atomic conflict, invalid SQL, reload and JSON export passed.");
  } catch (error) {
    if (page) {
      await page.screenshot({ path: path.join(tempRoot, "diagram-sql-failure.png"), fullPage: true });
      console.error((await page.locator("body").innerText()).slice(-6000));
    }
    console.error(logs.slice(-4000));
    throw error;
  } finally {
    clearTimeout(deadline);
    await browser?.close();
    if (child.exitCode === null) {
      const exited = new Promise((resolve) => child.once("exit", resolve));
      child.kill();
      await exited;
    }
    if (!path.resolve(fixture).startsWith(path.resolve(tempRoot) + path.sep)) throw new Error("Unsafe fixture path");
    fs.rmSync(fixture, { recursive: true, force: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
