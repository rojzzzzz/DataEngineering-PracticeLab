// Browser acceptance on the disposable DB used by a Streamlit instance.
// Start with PRACTICE_DB_PATH=<workspace>/tmp/constructor-browser.db, port 8518.
const path = require("node:path");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { chromium, python, browserOptions } = require("./browser_runtime.cjs");
const root = path.resolve(__dirname, "..");
const db = process.env.PRACTICE_DB_PATH || path.join(root, "tmp/constructor-browser.db");
if (!path.resolve(db).startsWith(path.join(root, "tmp") + path.sep)) throw new Error("Use a disposable database under tmp.");
function py(source, ...args) {
  return JSON.parse(execFileSync(python, ["-c", source, db, ...args.map(String)], {cwd: root, encoding: "utf8"}));
}
const ids = py(`import json,sys
from pathlib import Path
from src import database, constructor_artifacts as a
p=sys.argv[1];database.init_db(p)
b=json.loads(Path('data/challenges.json').read_text(encoding='utf-8'));ids={}
for cid in ['CM-002','CM-004','SQL-013','MOCK-001']:
 c=next(c for c in b['challenges'] if c['id']==cid)
 ids[cid]=database.save_attempt(p,{'challenge_id':cid,'status':'In progress','started_at':a.stamp(),'updated_at':a.stamp(),'answer':'Browser answer '+cid,'constructor_workspace':a.new_workspace(c)})
print(json.dumps(ids))`);
function read(aid) {
  return py("import json,sys;from src.database import get_attempt;print(json.dumps(get_attempt(sys.argv[1],int(sys.argv[2]))))", aid);
}
function failSaves(enable) {
  py(`import json,sys
from src.database import connect
with connect(sys.argv[1]) as c:
 c.execute("DROP TRIGGER IF EXISTS constructor_browser_save_failure")
 if sys.argv[2]=='true': c.execute("CREATE TRIGGER constructor_browser_save_failure BEFORE UPDATE OF constructor_workspace ON attempts BEGIN SELECT RAISE(ABORT,'Simulated browser save failure'); END")
print('null')`, enable);
}
(async () => {
  const browser = await chromium.launch(browserOptions);
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
  page.setDefaultTimeout(25000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  async function open(cid, slot) {
    await page.goto(`http://localhost:8518/?attempt=${ids[cid]}&workspace=${slot}`);
    await page.getByRole("button", {name: "Save and return to attempt", exact: true}).waitFor();
  }
  async function returnTo(cid) {
    await page.getByRole("button", {name: "Save and return to attempt", exact: true}).click();
    const answer = page.getByRole("textbox", {name: "Your solution", exact: true});
    await answer.waitFor();
    assert.equal(await answer.inputValue(), "Browser answer " + cid);
  }
  try {
    for (const [slot, name] of [["conceptual", "Business concepts"], ["logical", "Logical tables"]]) {
      await open("CM-002", slot);
      await page.getByRole("button", {name: /\+ Add (entity|table)/}).first().click();
      await page.getByRole("textbox", {name: "Entity name", exact: true}).fill(name);
      await page.getByRole("button", {name: "Fit view", exact: true}).click();
      await returnTo("CM-002");
    }
    await open("CM-002", "conceptual");
    await page.reload();
    await page.getByRole("button", {name: /Business concepts/}).waitFor();
    const models = read(ids["CM-002"]).constructor_workspace.artifacts;
    assert.equal(models.conceptual.payload.entities[0].name, "Business concepts");
    assert.equal(models.logical.payload.entities[0].name, "Logical tables");
    console.log("PASS independent conceptual/logical models, return and refresh");

    await open("CM-004", "pipeline");
    await page.getByRole("button", {name: "Source", exact: true}).click();
    await page.getByRole("button", {name: "Notes", exact: true}).click();
    await page.getByRole("textbox", {name: "Planning notes", exact: true}).fill("Browser recovery and monitoring notes");
    await returnTo("CM-004");
    await open("CM-004", "pipeline");
    await page.getByRole("button", {name: "Notes", exact: true}).click();
    assert.equal(await page.getByRole("textbox", {name: "Planning notes", exact: true}).inputValue(), "Browser recovery and monitoring notes");
    console.log("PASS pipeline open/edit/save/return/reopen");

    await open("SQL-013", "migration");
    await page.getByRole("textbox", {name: "Final reviewed SQL", exact: true}).fill("SELECT 1 AS reviewed_value;");
    await page.getByRole("button", {name: "Convert SQL", exact: true}).click();
    await page.getByRole("textbox", {name: "SQL output", exact: true}).filter({hasText: /SELECT/}).waitFor();
    await page.getByRole("tab", {name: "Visualize SQL", exact: true}).click();
    await page.getByRole("button", {name: "Visualize query", exact: true}).click();
    await page.waitForTimeout(1000);
    await returnTo("SQL-013");
    await open("SQL-013", "migration");
    assert.equal(await page.getByRole("textbox", {name: "Final reviewed SQL", exact: true}).innerText(), "SELECT 1 AS reviewed_value;");
    const sql = read(ids["SQL-013"]).constructor_workspace.artifacts.migration.payload;
    assert(sql.results.convert.result.sql);
    assert.equal(sql.results.visualize.inputs.sql, "SELECT 1 AS reviewed_value;");
    failSaves(true);
    await page.getByRole("textbox", {name: "Final reviewed SQL", exact: true}).fill("SELECT 2 AS recoverable_value;");
    await page.getByText(/Save failed/).first().waitFor();
    failSaves(false);
    const outerRetry = page.getByRole("button", {name: "Retry saving deliverable", exact: true});
    if (await outerRetry.count()) await outerRetry.click();
    else await page.getByRole("button", {name: "Retry save and return", exact: true}).click();
    await page.waitForTimeout(1500);
    if (!(await page.getByRole("textbox", {name: "Your solution", exact: true}).count())) await returnTo("SQL-013");
    assert.equal(read(ids["SQL-013"]).constructor_workspace.artifacts.migration.payload.reviewed_sql, "SELECT 2 AS recoverable_value;");
    console.log("PASS SQL hydration/evidence, simulated save failure and retry");

    await open("MOCK-001", "fixtures");
    await page.getByRole("textbox", {name: "Table name", exact: true}).fill("browser_customers");
    await page.getByRole("textbox", {name: "Table name", exact: true}).press("Tab");
    await returnTo("MOCK-001");
    await open("MOCK-001", "fixtures");
    assert.equal(await page.getByRole("textbox", {name: "Table name", exact: true}).inputValue(), "browser_customers");
    await page.getByRole("button", {name: "Generate data", exact: true}).click();
    await page.getByText("Generation evidence saved", {exact: true}).waitFor({timeout: 60000});
    await returnTo("MOCK-001");
    await open("MOCK-001", "fixtures");
    await page.getByText("Generation evidence saved", {exact: true}).waitFor();
    const mock = read(ids["MOCK-001"]).constructor_workspace.artifacts.fixtures.payload;
    assert.equal(mock.generation.status, "complete");
    assert(Object.values(mock.generation.samples).every(rows => rows.length <= 10));
    await page.screenshot({path: path.join(root, "tmp/attempt-constructor-browser.png"), fullPage: true});
    assert.deepEqual(errors, []);
    console.log("PASS mock recipe/generation evidence survives return and reopen");
  } finally {
    failSaves(false);
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
