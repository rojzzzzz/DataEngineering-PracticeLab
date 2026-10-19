import assert from "node:assert/strict";
import test from "node:test";
import { addSqlTables } from "../src/sqlDiagram.ts";

const table = (name, ifNotExists = false) => ({
  ifNotExists,
  entity: {
    id: name,
    name,
    role: "table",
    annotation: "",
    position: { x: 60, y: 60 },
    fields: [
      { id: `${name}-id`, name: "id", data_type: "INT", pk: true, fk: false },
    ],
  },
});
const empty = () => ({
  version: 1,
  kind: "logical_erd",
  entities: [],
  relationships: [],
  strokes: [],
});

test("SQL import appends to current local edits without changing existing data", () => {
  const original = addSqlTables(empty(), [table("customers")]);
  original.entities[0].annotation = "Unsaved local edit";
  original.strokes.push({ id: "local-ink" });
  const result = addSqlTables(original, [table("orders")]);
  assert.equal(result.entities.length, 2);
  assert.equal(result.entities[0], original.entities[0]);
  assert.equal(result.entities[0].annotation, "Unsaved local edit");
  assert.equal(result.strokes, original.strokes);
  assert.equal(result.relationships, original.relationships);
  assert.ok(result.entities[1].position.x > result.entities[0].position.x);
  assert.equal(original.entities.length, 1);
});

test("duplicate imports fail atomically; IF NOT EXISTS skips without overwriting", () => {
  const original = addSqlTables(empty(), [table("customers")]);
  assert.throws(
    () => addSqlTables(original, [table("orders"), table("CUSTOMERS")]),
    /already exists/,
  );
  assert.equal(original.entities.length, 1);
  assert.equal(addSqlTables(original, [table("customers", true)]), original);
  assert.equal(
    addSqlTables(original, [table("customers", true), table("orders")]).entities
      .length,
    2,
  );
  assert.throws(
    () => addSqlTables(empty(), [table("a"), table("a")]),
    /already exists/,
  );
});

test("SQL imports honor diagram roles and limits", () => {
  for (const [kind, role] of [
    ["conceptual_erd", "entity"],
    ["star_schema", "dimension"],
  ])
    assert.equal(
      addSqlTables({ ...empty(), kind }, [table("t")]).entities[0].role,
      role,
    );
  const original = addSqlTables(
    empty(),
    Array.from({ length: 100 }, (_, i) => table(`t${i}`)),
  );
  assert.throws(() => addSqlTables(original, [table("extra")]), /at most 100/);
  assert.equal(addSqlTables(original, [table("t0", true)]), original);
});
