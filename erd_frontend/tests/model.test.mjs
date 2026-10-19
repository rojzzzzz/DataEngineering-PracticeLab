import assert from "node:assert/strict";
import test from "node:test";
import {
  removeElements,
  arrangeEntities,
  nextName,
  moveField,
} from "../src/model.ts";
import { quoteIdentifier, selectQuery } from "../src/sql_helpers.ts";
import { exportSize } from "../src/imageExport.ts";

test("deleting selected drawings preserves model content and other strokes", () => {
  const input = {
    version: 1,
    kind: "logical_erd",
    entities: [{ id: "table" }],
    relationships: [],
    strokes: [{ id: "ink-1" }, { id: "ink-2" }],
  };
  const result = removeElements(input, ["ink-1"]);
  assert.deepEqual(result.strokes, [{ id: "ink-2" }]);
  assert.deepEqual(result.entities, input.entities);
  assert.deepEqual(result.relationships, input.relationships);
  assert.equal(input.strokes.length, 2);
  assert.deepEqual(
    arrangeEntities({ ...input, entities: [] }).strokes,
    input.strokes,
  );
});

test("PNG bounds include negative coordinates and cap large exports", () => {
  for (const bounds of [
    { x: -900, y: -700, width: 2000, height: 3000 },
    { x: 0, y: 0, width: 190000, height: 190000 },
    { x: 0, y: 0, width: 0, height: 0 },
  ]) {
    const size = exportSize(bounds);
    assert.ok(size.width <= 4096 && size.height <= 4096);
    assert.ok(size.width * size.height <= 12_010_000);
    assert.ok(bounds.x * size.scale + size.x > 0);
    assert.ok(bounds.y * size.scale + size.y > 0);
    assert.ok((bounds.x + bounds.width) * size.scale + size.x < size.width);
    assert.ok((bounds.y + bounds.height) * size.scale + size.y < size.height);
  }
});

test("SELECT builder quotes identifiers and uses only selected columns", () => {
  assert.equal(quoteIdentifier('a"b'), '"a""b"');
  assert.equal(
    selectQuery("order", ["id", "amount"]),
    'SELECT\n  "id",\n  "amount"\nFROM "order"\nLIMIT 100;',
  );
  assert.equal(
    selectQuery("sales", []),
    'SELECT\n  *\nFROM "sales"\nLIMIT 100;',
  );
});

const diagram = {
  version: 1,
  kind: "conceptual_erd",
  entities: ["a", "b", "c"].map((id) => ({ id })),
  relationships: [
    { id: "ab", source: "a", target: "b" },
    { id: "bc", source: "b", target: "c" },
    { id: "ac", source: "a", target: "c" },
  ],
};

test("tidy layout leaves room for tall tables and preserves model content", () => {
  const input = {
    ...diagram,
    entities: diagram.entities.map((e, i) => ({
      ...e,
      position: { x: 0, y: 0 },
      fields: Array(i === 0 ? 30 : 2).fill({}),
      annotation: i === 0 ? "Notes" : "",
    })),
  };
  const result = arrangeEntities(input);
  assert.equal(result.entities[0].position.y, result.entities[1].position.y);
  assert.ok(
    result.entities[2].position.y >
      result.entities[0].position.y + 30 * 30 + 140,
  );
  assert.equal(result.relationships, input.relationships);
  assert.equal(result.entities[0].fields, input.entities[0].fields);
  assert.deepEqual(input.entities[0].position, { x: 0, y: 0 });
  assert.deepEqual(arrangeEntities(result), result);
  assert.deepEqual(arrangeEntities({ ...input, entities: [] }).entities, []);
});

test("deleting an entity removes only its incident relationships", () => {
  const result = removeElements(diagram, ["b"]);
  assert.deepEqual(
    result.entities.map((entity) => entity.id),
    ["a", "c"],
  );
  assert.deepEqual(
    result.relationships.map((relation) => relation.id),
    ["ac"],
  );
  assert.equal(diagram.entities.length, 3);
  assert.equal(diagram.relationships.length, 3);
});

test("deleting a relationship preserves all entities", () => {
  const result = removeElements(diagram, [], ["ab"]);
  assert.deepEqual(result.entities, diagram.entities);
  assert.deepEqual(
    result.relationships.map((relation) => relation.id),
    ["bc", "ac"],
  );
});

test("a mixed selection deletes entities and unrelated selected edges", () => {
  const result = removeElements(diagram, ["b"], ["ac"]);
  assert.equal(result.entities.length, 2);
  assert.deepEqual(result.relationships, []);
});

test("new names fill gaps without colliding with existing names or copies", () => {
  assert.equal(
    nextName(["table_1", " TABLE_2 ", "table_4"], "table"),
    "table_3",
  );
  assert.equal(
    nextName(["orders_copy_1", "orders_copy_2"], "orders_copy"),
    "orders_copy_3",
  );
  assert.equal(nextName([], "field"), "field_1");
});

test("field reordering preserves keys, other tables, connections and the original", () => {
  const fields = [
    { id: "pk", name: "id", pk: true, fk: false, data_type: "INTEGER" },
    { id: "fk", name: "parent_id", pk: false, fk: true, data_type: "INTEGER" },
    { id: "name", name: "name", pk: false, fk: false, data_type: "VARCHAR" },
  ];
  const input = {
    ...diagram,
    entities: [
      { id: "a", fields },
      { id: "b", fields: [] },
    ],
  };
  const result = moveField(input, "a", "fk", -1);
  assert.deepEqual(
    result.entities[0].fields.map((field) => field.id),
    ["fk", "pk", "name"],
  );
  assert.equal(result.entities[0].fields[0], fields[1]);
  assert.equal(result.entities[1], input.entities[1]);
  assert.equal(result.relationships, input.relationships);
  assert.deepEqual(
    input.entities[0].fields.map((field) => field.id),
    ["pk", "fk", "name"],
  );
  assert.deepEqual(moveField(result, "a", "fk", 1), input);
  assert.equal(moveField(input, "a", "pk", -1), input);
  assert.equal(moveField(input, "a", "name", 1), input);
  assert.equal(moveField(input, "missing", "pk", 1), input);
  assert.equal(moveField(input, "a", "missing", 1), input);
});
