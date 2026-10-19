// Exercise the shipped editor bundles against a local, deterministic save adapter.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium, browserOptions } = require("./browser_runtime.cjs");
const root = path.resolve(__dirname, "..");
const models = {
  sql: { attemptId: 1, exerciseHash: "fixture", active: "answer", drafts: { answer: "", scratch: "" },
    savedDrafts: { answer: "", scratch: "" }, tables: [], tasks: [{ id: "answer", title: "Answer", description: "Write SQL", columns: [] }],
    schema: {}, ddl: "", busy: false, executionOnly: false, notebooks: [] },
  python: { attemptId: 1, exerciseHash: "fixture", source: "", starter: "", busy: false, ready: false, checkReady: false, assessedSource: null },
};
const server = http.createServer((req, res) => {
  const match = /^\/(sql|python)(?:\/(editor\.(?:js|css)))?$/.exec(req.url);
  if (!match) { res.writeHead(404); res.end(); return; }
  const [, kind, asset] = match;
  if (asset) {
    res.setHeader("Content-Type", asset.endsWith(".js") ? "text/javascript" : "text/css");
    res.end(fs.readFileSync(path.join(root, "src", kind + "_assets", asset)));
    return;
  }
  res.setHeader("Content-Type", "text/html");
  res.end(`<!doctype html><link rel="stylesheet" href="/${kind}/editor.css"><div id="host"><div class="${kind}-root"></div></div><script type="module">
  import render from '/${kind}/editor.js';
  window.model=${JSON.stringify(models[kind])}; window.feedback={}; window.events=[]; window.pendingEvents=[];
  const parentElement=document.querySelector('#host'); let dispose;
  function show(){dispose=render({parentElement,data:[window.model],setStateValue:(key,value)=>{window.feedback[key]=value;if(key==='event')window.events.push(value);if(key==='pending')window.pendingEvents.push(value);}});}
  window.update=(value)=>{window.model={...window.model,...value};show();};
  window.remount=()=>{dispose();parentElement.innerHTML='<div class="${kind}-root"></div>';show();};
  show();</script>`);
});

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch(browserOptions);
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    async function type(text) {
      await page.locator(".cm-content").click();
      await page.keyboard.press("ControlOrMeta+A");
      await page.keyboard.type(text);
      await page.waitForFunction(() => window.feedback.pending === true);
      await page.waitForFunction(text => {
        const event = window.feedback.event;
        return event && (event.source === text || Object.values(event.drafts || {}).includes(text));
      }, text);
    }
    await page.goto(base + "/sql");
    await type("SELECT 'retain this draft'");
    assert.equal(await page.evaluate(() => window.pendingEvents.filter(Boolean).length), 1);
    await page.evaluate(() => window.remount());
    await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("retain this draft"));
    await page.waitForFunction(() => window.feedback.pending === true);
    await page.evaluate(() => window.update({ drafts: window.feedback.event.drafts, savedDrafts: window.feedback.event.drafts }));
    await page.waitForFunction(() => window.feedback.pending === false);
    // A Detective notebook is a separate draft and participates in recovery.
    await page.evaluate(() => window.update({ attemptId: 2, active: "notebook_1", detective: true,
      notebooks: ["notebook_1"], drafts: { answer: "", notebook_1: "" }, savedDrafts: { answer: "", notebook_1: "" } }));
    await type("SELECT 'notebook recovery'");
    await page.evaluate(() => window.remount());
    await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("notebook recovery"));
    // A newer server save must survive an older, conflicting browser recovery.
    await page.evaluate(() => {
      window.model = { ...window.model, drafts: { answer: "", notebook_1: "SELECT 'newer saved work'" }, savedDrafts: { answer: "", notebook_1: "SELECT 'newer saved work'" } };
      window.remount();
    });
    await page.getByRole("button", { name: "Download earlier browser draft" }).waitFor();
    assert.match(await page.locator(".cm-content").textContent(), /newer saved work/);
    await page.evaluate(() => window.update({ recoveryScope: "another-database", drafts: { answer: "", notebook_1: "" }, savedDrafts: { answer: "", notebook_1: "" } }));
    await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent === "");
    assert.equal(await page.getByRole("button", { name: "Download earlier browser draft" }).count(), 0);
    await page.goto(base + "/python");
    await type("print('Python pending')");
    assert.equal(await page.evaluate(() => window.pendingEvents.filter(Boolean).length), 1);
    await page.evaluate(() => window.update({ source: window.feedback.event.source }));
    await page.waitForFunction(() => window.feedback.pending === false);
    await page.evaluate(() => window.update({ attemptId: 2, source: "print('different attempt')" }));
    await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent.includes("different attempt"));
    assert.deepEqual(errors, []);
    console.log("Editor recovery passed: SQL save failure/remount, Detective notebooks, conflict preservation, Python dirty/acknowledgment, attempt isolation.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
