import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  defaults,
  readWorkspace,
  responseMatches,
  graphPositions,
  queryPositions,
  queryRoutes,
  queryNodeSize,
  graphPath,
  graphNodeContent,
  visibleGraph,
} from "../src/sqlToolsModel.ts";
const dialects = JSON.parse(
  fs.readFileSync(
    new URL("../../src/sql_tools_dialects.json", import.meta.url),
    "utf8",
  ),
);

test("query layout keeps branches apart and advances along both orientations", () => {
  const graph = {
    nodes: ["source-a", "source-b", "join", "select", "output"].map((id) => ({
      id,
      label: id,
      kind: "operation",
      properties: {},
    })),
    edges: [
      ["source-a", "join"],
      ["source-b", "join"],
      ["join", "select"],
      ["select", "output"],
    ].map(([source, target], i) => ({
      id: `e${i}`,
      source,
      target,
      label: "",
    })),
    diagnostics: [],
  };
  const before = JSON.stringify(graph);
  for (const direction of ["vertical", "horizontal"]) {
    const positions = queryPositions(graph, direction);
    const byId = new Map(positions.map((n) => [n.id, n.position]));
    const axis = direction === "vertical" ? "y" : "x";
    for (const edge of graph.edges)
      assert.ok(byId.get(edge.target)[axis] > byId.get(edge.source)[axis]);
    for (let i = 0; i < positions.length; i++)
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i].position,
          b = positions[j].position;
        assert.ok(
          Math.abs(a.x - b.x) >= queryNodeSize.width ||
            Math.abs(a.y - b.y) >= queryNodeSize.height,
        );
      }
    assert.deepEqual(queryPositions(graph, direction), positions);
  }
  assert.equal(JSON.stringify(graph), before);
});

test("query paths trace ancestors and descendants without including sibling branches", () => {
  const graph = {
    nodes: ["a", "b", "join", "output", "unrelated"].map((id) => ({
      id,
      label: id,
      kind: "table",
      properties: {},
    })),
    edges: [
      { source: "a", target: "join" },
      { source: "b", target: "join" },
      { source: "join", target: "output" },
    ],
    diagnostics: [],
  };
  assert.deepEqual([...graphPath(graph, "a")].sort(), ["a", "join", "output"]);
  assert.deepEqual([...graphPath(graph, "join")].sort(), [
    "a",
    "b",
    "join",
    "output",
  ]);
  graph.edges.push({ source: "output", target: "a", back: true });
  assert.ok(graphPath(graph, "a").has("output"));
  assert.equal(graphPath(graph, null).size, 5);
  assert.equal(queryPositions(graph).length, 5);
});

test("long and recursive arrows route outside nodes in both layouts", () => {
  const graph = {
    nodes: ["source", "filter", "select", "output"].map((id) => ({
      id,
      label: id,
      kind: "operation",
      properties: {},
    })),
    edges: [
      { id: "a", source: "source", target: "filter", label: "" },
      { id: "b", source: "filter", target: "select", label: "" },
      { id: "c", source: "select", target: "output", label: "" },
      { id: "skip", source: "source", target: "output", label: "dependency" },
      {
        id: "recursive",
        source: "output",
        target: "source",
        label: "recursive reference",
        back: true,
      },
    ],
    diagnostics: [],
  };
  for (const direction of ["vertical", "horizontal"]) {
    const positions = queryPositions(graph, direction),
      lanes = queryRoutes(graph, positions, direction);
    assert.equal(lanes.has("a"), false);
    const axis = direction === "vertical" ? "x" : "y",
      size =
        direction === "vertical" ? queryNodeSize.width : queryNodeSize.height;
    for (const id of ["skip", "recursive"]) {
      const lane = lanes.get(id);
      assert.ok(
        positions.every(
          (node) =>
            lane < node.position[axis] || lane > node.position[axis] + size,
        ),
      );
    }
    assert.notEqual(lanes.get("skip"), lanes.get("recursive"));
  }
});

test("node content exposes conditions and expressions without inventing plan metrics", () => {
  assert.equal(
    graphNodeContent({
      id: "j",
      kind: "join",
      label: "LEFT JOIN",
      properties: { condition: "c.id = o.customer_id" },
    }).preview,
    "c.id = o.customer_id",
  );
  assert.equal(
    graphNodeContent({
      id: "s",
      kind: "select",
      label: "SELECT",
      properties: { columns: ["c.id", "SUM(o.total) AS total"] },
    }).preview,
    "c.id, SUM(o.total) AS total",
  );
  assert.equal(
    graphNodeContent({
      id: "t",
      kind: "table",
      label: "analytics.orders AS o",
      properties: { name: "orders", alias: "o" },
    }).title,
    "analytics.orders AS o",
  );
  assert.equal(
    graphNodeContent({ id: "p", kind: "plan", label: "Scan", properties: {} })
      .preview,
    "",
  );
  assert.equal(
    graphNodeContent({
      id: "p",
      kind: "plan",
      label: "Scan",
      properties: { "Plan Rows": 0 },
    }).preview,
    "0 estimated rows",
  );
});
test("workspace roundtrip validates payload rather than trusting uploaded settings", () => {
  const value = {
    format: "constructor-sql-workspace",
    version: 1,
    sql: "select 1",
    plan: "",
    settings: defaults,
  };
  assert.deepEqual(
    readWorkspace(JSON.stringify(value), Object.keys(dialects)),
    value,
  );
  for (const invalid of [
    { ...value, version: 2 },
    { ...value, sql: "x".repeat(200001) },
    { ...value, settings: { ...defaults, dialect: "x" } },
  ])
    assert.throws(() =>
      readWorkspace(JSON.stringify(invalid), Object.keys(dialects)),
    );
});
test("responses from old edits, requests and closed workspaces are rejected", () => {
  const response = { workspaceId: "w", id: "r", revision: 2 };
  assert.equal(responseMatches(response, "w", "r", 2), true);
  assert.equal(responseMatches(response, "w", "r", 3), false);
  assert.equal(responseMatches(response, "new", "r", 2), false);
  assert.equal(responseMatches(response, "w", null, 2), false);
});
test("plan collapse and recursive graph layout terminate", () => {
  const graph = {
    nodes: ["a", "b", "c"].map((id) => ({
      id,
      label: id,
      kind: "plan",
      properties: {},
    })),
    edges: [
      { id: "e1", source: "a", target: "b" },
      { id: "e2", source: "b", target: "c" },
    ],
    diagnostics: [],
  };
  assert.deepEqual(
    visibleGraph(graph, new Set(["a"])).nodes.map((n) => n.id),
    ["a"],
  );
  const positions = graphPositions({
    ...graph,
    edges: [...graph.edges, { id: "e3", source: "c", target: "a", back: true }],
  });
  assert.equal(positions[2].position.x, 840);
});
test("large plans lay out and collapse without repeated edge scans", () => {
  const count = 500;
  const graph = {
    nodes: Array.from({ length: count }, (_, i) => ({
      id: `n${i}`,
      label: `Node ${i}`,
      kind: "plan",
      properties: {},
    })),
    edges: Array.from({ length: count - 1 }, (_, i) => ({
      id: `e${i}`,
      source: `n${i}`,
      target: `n${i + 1}`,
      label: "input",
    })),
    diagnostics: [],
  };
  assert.equal(graphPositions(graph).at(-1).position.x, (count - 1) * 420);
  assert.equal(
    graphPositions(graph, true).at(-1).position.x,
    (count - 1) * 420,
  );
  assert.deepEqual(
    visibleGraph(graph, new Set(["n0"])).nodes.map((node) => node.id),
    ["n0"],
  );
});

test("legacy workspaces default to 88 columns and invalid widths are rejected", () => {
  const settings = { ...defaults };
  delete settings.lineLength;
  const value = {
    format: "constructor-sql-workspace",
    version: 1,
    sql: "select 1",
    plan: "",
    settings,
  };
  assert.equal(
    readWorkspace(JSON.stringify(value), Object.keys(dialects)).settings
      .lineLength,
    88,
  );
  assert.throws(() =>
    readWorkspace(
      JSON.stringify({ ...value, settings: { ...settings, lineLength: 10 } }),
      Object.keys(dialects),
    ),
  );
});
