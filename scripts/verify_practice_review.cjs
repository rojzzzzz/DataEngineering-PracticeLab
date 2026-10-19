// Resume/preview/repair acceptance against a disposable local Streamlit database.
const path = require("node:path");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { chromium, python, browserOptions } = require("./browser_runtime.cjs");
const root = path.resolve(__dirname, "..");
const db = process.env.PRACTICE_DB_PATH || path.join(root, "tmp/release-browser.db");
const base = process.env.PRACTICE_BROWSER_URL || "http://localhost:8518";
if (!path.resolve(db).startsWith(path.join(root, "tmp") + path.sep)) throw new Error("Use a disposable database under tmp.");
function py(source, ...args) {
  return JSON.parse(execFileSync(python, ["-c", source, db, ...args.map(String)], { cwd: root, encoding: "utf8" }));
}
const ids = py(`import json,sys
from pathlib import Path
from src import database as d, constructor_artifacts as a
from scripts.build_repair_exercises import _native
p=sys.argv[1];d.init_db(p);b=json.loads(Path('data/challenges.json').read_text(encoding='utf-8'));ids={}
for cid in ['REP-001','REP-002','REP-003','CM-002','CM-004','INC-004','MOCK-001']:
 c=next(c for c in b['challenges'] if c['id']==cid)
 aid=d.save_attempt(p,{'challenge_id':cid,'status':'In progress','started_at':a.stamp(),'updated_at':a.stamp(),'confidence':3,'constructor_workspace':a.new_workspace(c)});ids[cid]=aid
 if cid=='CM-002':
  for slot in c['constructor_tasks']['slots']:
   doc=a.initial_payload(slot);doc['entities']=[{'id':'e','name':slot['label'],'position':{'x':0,'y':0}}]
   a.save_artifact(p,aid,slot['id'],doc,0)
 if cid=='CM-004':
  slot=c['constructor_tasks']['slots'][0];doc=a.initial_payload(slot)
  doc['elements']=[_native('node-'+str(i),'rectangle',(i%40)*260,(i//40)*140) for i in range(1999)]
  doc['elements'].append(_native('image','image',0,0,50,50,fileId='png'))
  doc['files']={'png':{'id':'png','mimeType':'image/png','dataURL':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=','created':1}}
  a.save_artifact(p,aid,slot['id'],doc,0)
 if cid=='INC-004':
  from src.sql_plan_parser import parse_plan
  for slot in c['constructor_tasks']['slots']:
   doc=a.initial_payload(slot);doc['reviewed_sql']=doc['sql'];doc['results']={'explain':{'revision':0,'inputs':{'plan':doc['plan'],'settings':doc['settings']},'result':parse_plan(doc['plan'])}}
   a.save_artifact(p,aid,slot['id'],doc,0)
 c=next(c for c in b['challenges'] if c['id']=='MOCK-001') if cid=='MOCK-001' else c
 if cid=='MOCK-001':
  previous=next((v for v in d.list_attempts(p,cid) if v['attempt_id']!=aid and (v.get('constructor_workspace') or {}).get('artifacts',{}).get('fixtures',{}).get('payload',{}).get('generation')),None)
  if previous:
   payload=previous['constructor_workspace']['artifacts']['fixtures']['payload']
   a.save_artifact(p,aid,'fixtures',payload,0)
print(json.dumps(ids))`);
const read = aid => py("import json,sys;from src.database import get_attempt;print(json.dumps(get_attempt(sys.argv[1],int(sys.argv[2]))))", aid);
(async () => {
  const browser = await chromium.launch(browserOptions);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(40000);
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  async function settled() {
    await page.waitForFunction(() => document.querySelector('[data-testid="stApp"]')?.getAttribute('data-test-script-state') === 'notRunning');
    await page.waitForTimeout(1000);
  }
  async function open(cid, slot) {
    await page.goto(`${base}/?attempt=${ids[cid]}&workspace=${slot}`);
    await page.getByRole("button", { name: "Save and return to attempt", exact: true }).waitFor();
    await settled();
  }
  async function returned() {
    await page.getByRole("button", { name: "Save and return to attempt", exact: true }).click();
    await page.getByRole("textbox", { name: "Your solution", exact: true }).waitFor();
    await settled();
  }
  async function overview() {
    await page.getByText("Submission overview", { exact: true }).click();
    await settled();
    return page.getByTestId("stExpander").filter({ has: page.getByText("Submission overview", { exact: true }) }).first();
  }
  try {
    for (const [cid, slot, preview] of [["REP-001", "star", "Enlarge diagram"], ["REP-002", "pipeline", "Enlarge pipeline"], ["REP-003", "dataset", null]]) {
      const before = read(ids[cid]);
      await open(cid, slot);
      assert.deepEqual(read(ids[cid]), before, `${cid} opening must not save`);
      await page.getByText("Original supplied design", { exact: true }).click();
      if (preview) await page.getByRole("button", { name: preview, exact: true }).waitFor();
      await settled();
      assert.deepEqual(read(ids[cid]), before, `${cid} original preview must not save`);
      await page.screenshot({ path: path.join(root, `tmp/${cid}-starter.png`), fullPage: true });
      await returned();
      assert(await page.getByRole("button", { name: "Mark Complete", exact: true }).isDisabled());
      console.log(`PASS ${cid} real starter editor, original reference, no progress writes and completion gate`);
    }
    await open("CM-002", "logical");
    await returned();
    const before = read(ids["CM-002"]);
    assert.equal(await page.getByRole("button", { name: "Enlarge diagram", exact: true }).count(), 0);
    let panel = await overview();
    await panel.getByRole("button", { name: "Enlarge diagram", exact: true }).nth(1).waitFor();
    assert.equal(await panel.locator(".react-flow__node:visible").count(), 2);
    assert.equal(await panel.getByRole("button", { name: /Add entity|Add table|Undo/ }).count(), 0);
    await panel.getByRole("button", { name: "Enlarge diagram", exact: true }).first().click();
    await page.getByRole("button", { name: "Close enlarged diagram", exact: true }).first().click();
    assert.deepEqual(read(ids["CM-002"]), before);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(700);
    const columns = panel.getByTestId("stColumn");
    const boxes = await Promise.all([columns.nth(0).boundingBox(), columns.nth(1).boundingBox()]);
    assert(boxes[1].y > boxes[0].y + boxes[0].height - 5, "Mobile overview cards must stack");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2));
    await panel.screenshot({ path: path.join(root, "tmp/submission-narrow.png") });
    await page.setViewportSize({ width: 1440, height: 1000 });
    console.log("PASS lazy independent diagrams, read-only enlargement and narrow layout");

    await open("CM-004", "pipeline");
    await returned();
    const pipelineBefore = read(ids["CM-004"]);
    panel = await overview();
    await panel.getByRole("button", { name: "Enlarge pipeline", exact: true }).waitFor({timeout: 60000});
    const img = panel.getByRole("img", { name: "Saved pipeline design", exact: true });
    await img.waitFor();
    assert(await img.evaluate(el => el.complete && el.naturalWidth > 0));
    await panel.getByRole("button", { name: "Enlarge pipeline", exact: true }).click();
    await page.getByRole("button", { name: "Close enlarged pipeline", exact: true }).click();
    assert.deepEqual(read(ids["CM-004"]), pipelineBefore);
    await panel.screenshot({ path: path.join(root, "tmp/submission-large-pipeline.png") });
    console.log("PASS 2000-element pipeline with embedded image exported read-only without writes");

    await open("INC-004", "before");
    await returned();
    panel = await overview();
    assert.equal(await panel.getByText("Explain saved analysis summary", {exact:true}).count(), 2);
    assert(await panel.getByText(/Source: postgres/).count());
    console.log("PASS saved SQL dialects, excerpts, evidence currency and analysis summaries");

    const mock = read(ids["MOCK-001"]);
    if (mock.constructor_workspace.artifacts.fixtures) {
      await open("MOCK-001", "fixtures");
      await returned();
      const beforeMock = read(ids["MOCK-001"]);
      panel = await overview();
      await panel.getByText("Saved generation manifest statistics", { exact: true }).waitFor();
      assert(await panel.getByText(/Saved bounded sample/).count());
      assert.deepEqual(read(ids["MOCK-001"]), beforeMock);
      console.log("PASS saved mock relationships, generation rules, manifest and bounded samples without writes");
    }
    await open("INC-004", "before");
    await returned();

    // Work on an answer, refresh and use the precise card. A stale slot target
    // must route safely to the overview rather than create another artifact.
    const answer = page.getByRole("textbox", { name: "Your solution", exact: true });
    await answer.fill("Browser diagnosis and verification plan");
    await answer.press("Tab");
    await settled();
    assert.equal(read(ids["INC-004"]).resume_target, "answer");
    await page.reload();
    await page.getByRole("button", {name:"Continue written answer",exact:true}).waitFor();
    await page.getByRole("button", {name:"Continue written answer",exact:true}).click();
    await answer.waitFor();
    assert.equal(await answer.inputValue(), "Browser diagnosis and verification plan");
    assert.deepEqual(errors, []);
    console.log("PASS exact saved-answer resume after refresh; no browser errors");
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
