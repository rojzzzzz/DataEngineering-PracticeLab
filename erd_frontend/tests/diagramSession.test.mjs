import assert from "node:assert/strict";
import test from "node:test";
import { DiagramSession } from "../src/diagramSession.ts";

function table(id = "customers") {
  return {
    id,
    name: id,
    role: "table",
    annotation: "",
    position: { x: 0, y: 0 },
    fields: [],
  };
}
function diagram() {
  return {
    version: 1,
    kind: "logical_erd",
    entities: [table()],
    relationships: [],
  };
}
const rename = (value, name) => ({
  ...value,
  entities: value.entities.map((entity, index) =>
    index ? entity : { ...entity, name },
  ),
});
const command = (id = "import-1", name = "orders") => ({
  id,
  tables: [{ entity: table(name), ifNotExists: false }],
});

function setup(t, extra = {}) {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const records = new Map();
  const storage = {
    getItem: (key) => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
    removeItem: (key) => records.delete(key),
  };
  const sent = [];
  let now = 1000;
  const initial = diagram();
  const options = {
    documentId: "constructor:one",
    diagram: initial,
    workspace: true,
    storage,
    save: (value) => sent.push(value),
    now: () => now,
    ...extra,
  };
  const session = new DiagramSession(options);
  session.start();
  return {
    session,
    options,
    sent,
    records,
    initial,
    advance: (ms) => {
      now += ms;
      t.mock.timers.tick(ms);
    },
  };
}

test("import, undo, failed acknowledgment and remount preserve the latest draft", (t) => {
  const { session, options, sent, initial } = setup(t);
  const edited = rename(initial, "clients");
  session.commit(edited);
  const result = session.importSql(command());
  assert.equal(result.message, "Added 1 table to the diagram.");
  assert.equal(result.firstEntityId, "orders");
  assert.equal(session.diagram.entities[0].name, "clients");
  assert.equal(sent.length, 1); // The pending text is included in the structural save.
  session.travel("past");
  assert.deepEqual(session.diagram, edited);
  assert.equal(session.getSnapshot().isSaved, false);
  // The server save fails: no acknowledgment arrives before remounting.
  const reopened = new DiagramSession(options);
  assert.deepEqual(reopened.diagram, edited);
  assert.equal(reopened.getSnapshot().conflictingDraft, null);
  reopened.start();
  assert.deepEqual(sent.at(-1), edited);
  assert.equal(reopened.getSnapshot().canUndo, false);
  reopened.acknowledge(edited);
  assert.equal(reopened.getSnapshot().isSaved, true);
});

test("typing coalesces saves and undo steps; structural edits and redo save immediately", (t) => {
  const { session, initial, sent, advance } = setup(t);
  session.commit(rename(initial, "c"));
  advance(100);
  session.commit(rename(session.diagram, "clients"));
  advance(499);
  assert.equal(sent.length, 0);
  advance(1);
  assert.equal(sent.length, 1);
  session.travel("past");
  assert.deepEqual(session.diagram, initial);
  assert.equal(session.getSnapshot().canUndo, false);
  assert.equal(session.getSnapshot().canRedo, true);
  session.travel("future");
  assert.equal(session.diagram.entities[0].name, "clients");
  session.importSql(command());
  session.travel("past");
  assert.equal(session.diagram.entities.length, 1);
  session.travel("future");
  assert.equal(session.diagram.entities.length, 2);
  assert.equal(sent.at(-1).entities.length, 2);
});

test("a paused edit starts a new undo step and new edits clear redo", (t) => {
  const { session, initial, advance } = setup(t);
  const first = rename(initial, "first");
  session.commit(first);
  advance(601);
  session.commit(rename(first, "second"));
  session.travel("past");
  assert.deepEqual(session.diagram, first);
  assert.equal(session.getSnapshot().canRedo, true);
  session.commit(rename(first, "replacement"));
  assert.equal(session.getSnapshot().canRedo, false);
});

test("history retains fifty edit steps", (t) => {
  const { session, advance } = setup(t);
  for (let index = 1; index <= 55; index++) {
    session.commit(rename(session.diagram, `edit-${index}`));
    advance(601);
  }
  for (let index = 0; index < 60; index++) session.travel("past");
  assert.equal(session.diagram.entities[0].name, "edit-5");
  assert.equal(session.getSnapshot().canUndo, false);
});

test("delayed acknowledgment rebases a newer recovery draft without clearing it", (t) => {
  const { session, initial, options, records } = setup(t);
  const first = rename(initial, "first");
  session.commit(first);
  session.flush();
  const newer = rename(first, "newer");
  session.commit(newer);
  session.acknowledge(first);
  assert.equal(session.getSnapshot().isSaved, false);
  assert.equal(records.size, 1);
  const reopened = new DiagramSession({
    ...options,
    diagram: first,
    savedDiagram: first,
  });
  assert.deepEqual(reopened.diagram, newer);
  assert.equal(reopened.getSnapshot().conflictingDraft, null);
  session.flush();
  session.acknowledge(newer);
  assert.equal(records.size, 0);
  assert.equal(session.getSnapshot().isSaved, true);
});

test("unrecognized saved version requires conflict review on remount", (t) => {
  const { session, options, initial, sent } = setup(t);
  const local = rename(initial, "local draft");
  session.commit(local);
  session.flush();
  const external = rename(initial, "saved elsewhere");
  session.acknowledge(external);
  const reopened = new DiagramSession({
    ...options,
    diagram: external,
    savedDiagram: external,
  });
  reopened.start();
  assert.deepEqual(reopened.diagram, external);
  assert.deepEqual(reopened.getSnapshot().conflictingDraft, local);
  const count = sent.length;
  reopened.restoreDraft();
  assert.deepEqual(reopened.diagram, local);
  assert.equal(reopened.getSnapshot().conflictingDraft, null);
  assert.equal(sent.length, count + 1);
});

test("discarding a conflicting draft keeps the saved diagram and sends nothing", (t) => {
  const { session, options, initial, records, sent } = setup(t);
  session.commit(rename(initial, "local"));
  session.flush();
  const external = rename(initial, "external");
  const reopened = new DiagramSession({ ...options, diagram: external });
  const count = sent.length;
  reopened.discardDraft();
  assert.deepEqual(reopened.diagram, external);
  assert.equal(reopened.getSnapshot().conflictingDraft, null);
  assert.equal(records.size, 0);
  assert.equal(sent.length, count);
});

test("SQL import replays are ignored and conflicts leave edits and history intact", (t) => {
  const { session, sent } = setup(t);
  const imported = command();
  session.importSql(imported);
  const before = session.diagram;
  assert.equal(session.importSql(imported), null);
  assert.equal(sent.length, 1);
  const conflict = session.importSql({
    id: "bad",
    tables: [
      { entity: table("temporary"), ifNotExists: false },
      { entity: table("customers"), ifNotExists: false },
    ],
  });
  assert.match(conflict.error, /already exists/);
  assert.equal(session.diagram, before);
  assert.equal(sent.length, 1);
  session.travel("past");
  assert.equal(session.diagram.entities.length, 1);
});

test("skipping an existing table neither saves nor creates an undo step", (t) => {
  const { session, sent } = setup(t);
  const result = session.importSql({
    id: "skip",
    tables: [{ entity: table(), ifNotExists: true }],
  });
  assert.equal(
    result.message,
    "All tables already exist; the diagram was unchanged.",
  );
  assert.equal(session.getSnapshot().canUndo, false);
  assert.equal(sent.length, 0);
});

test("flush on leaving sends the latest text once and cancels its timer", (t) => {
  const { session, sent, advance } = setup(t);
  session.commit(rename(session.diagram, "latest"));
  session.flush();
  session.flush();
  advance(1000);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].entities[0].name, "latest");
});

test("storage failure does not block editing, undo or saving", (t) => {
  const fail = () => {
    throw new Error("Storage unavailable");
  };
  const { session, sent } = setup(t, {
    storage: { getItem: fail, setItem: fail, removeItem: fail },
  });
  session.importSql(command());
  session.travel("past");
  session.acknowledge(session.diagram);
  assert.equal(sent.length, 2);
  assert.equal(session.diagram.entities.length, 1);
});

test("embedded editing and other documents do not read a workspace draft", (t) => {
  const { session, options, initial } = setup(t);
  session.commit(rename(initial, "unsaved"));
  const embedded = new DiagramSession({ ...options, workspace: false });
  const other = new DiagramSession({
    ...options,
    documentId: "constructor:two",
  });
  assert.deepEqual(embedded.diagram, initial);
  assert.deepEqual(other.diagram, initial);
});

test("subscribers see edit, undo and acknowledgment snapshots; reads stay stable", (t) => {
  const { session } = setup(t);
  const first = session.getSnapshot();
  assert.equal(session.getSnapshot(), first);
  let notifications = 0;
  const unsubscribe = session.subscribe(() => notifications++);
  session.importSql(command());
  assert.equal(notifications, 1);
  assert.notEqual(session.getSnapshot(), first);
  session.acknowledge(session.diagram);
  assert.equal(notifications, 2);
  unsubscribe();
  session.travel("past");
  assert.equal(notifications, 2);
});
