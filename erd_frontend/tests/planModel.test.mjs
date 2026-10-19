import test from "node:test";
import assert from "node:assert/strict";
import {
  planMetrics,
  planSignals,
  planOverview,
  planPositions,
  planNodeSize,
  planMetricRows,
  planNumber,
} from "../src/planModel.ts";
const node = (properties = {}, id = "n0") => ({
  id,
  label: "Seq Scan",
  kind: "plan",
  properties,
});
test("metrics preserve missing values, zeros, and per-loop semantics", () => {
  const m = planMetrics(
    node({
      "Actual Rows": 0,
      "Actual Total Time": 2.5,
      "Actual Loops": 4,
      "Plan Rows": 12,
    }),
  );
  assert.equal(m.actual, 0);
  assert.equal(m.cumulative, 10);
  assert.equal(m.time, 2.5);
  assert.equal(
    planMetrics(node({ "Actual Rows": 3, "Actual Loops": 1 })).time,
    undefined,
  );
  assert.equal(
    planMetrics(node({ "Actual Total Time": 2 })).cumulative,
    undefined,
  );
  for (const v of [null, "12", true, Infinity, NaN, -1])
    assert.equal(planNumber({ x: v }, "x"), undefined);
  assert.equal(
    planMetrics(node({ "Actual Loops": 0, "Actual Total Time": 0 })).never,
    true,
  );
  assert.equal(
    planMetrics(
      node({
        "Never Executed": true,
        "Actual Total Time": 2,
        "Actual Loops": 1,
      }),
    ).cumulative,
    undefined,
  );
});
test("review points require supplied evidence and retain comparison context", () => {
  assert.equal(planSignals(node({ "Plan Rows": 10 })).length, 0);
  const s = planSignals(
    node({
      "Plan Rows": 10,
      "Actual Rows": 120,
      "Actual Loops": 2,
      "Sort Space Type": "Disk",
      "Sort Space Used": 44,
      "Hash Batches": 4,
      "Temp Written Blocks": 8,
    }),
  );
  assert.equal(s.length, 4);
  assert.match(s[0].detail, /Partial execution/);
  assert.equal(
    planSignals(node({ "Plan Rows": 1, "Actual Rows": 100, "Actual Loops": 0 }))
      .length,
    0,
  );
  assert.equal(
    planSignals(node({ "Plan Rows": 10, "Actual Rows": 99 })).length,
    0,
  );
});
test("multiple plan summaries use supplied times without synthesizing totals", () => {
  const graph = {
    nodes: [node({ "Total Cost": 12 }, "a"), node({ "Actual Rows": 0 }, "b")],
    edges: [],
    summary: {
      "Plan 1": { "Execution Time": 3 },
      "Plan 2": { "Planning Time": 0 },
    },
  };
  const rows = planOverview(graph);
  assert.equal(rows[0].execution, 3);
  assert.equal(rows[1].execution, undefined);
  assert.equal(rows[1].planning, 0);
  assert.deepEqual(
    planMetricRows(
      node({ "Shared Hit Blocks": 0, "Temp Written Blocks": 5 }),
    ).map((x) => x.value),
    ["0", "5"],
  );
});
test("plan branches remain spaced in either orientation", () => {
  const graph = {
    nodes: [node({}, "a"), node({}, "b"), node({}, "c")],
    edges: [
      { id: "ab", source: "a", target: "b", label: "Outer" },
      { id: "ac", source: "a", target: "c", label: "Inner" },
    ],
  };
  for (const direction of ["vertical", "horizontal"]) {
    const p = planPositions(graph, direction);
    const b = p.find((x) => x.id === "b").position,
      c = p.find((x) => x.id === "c").position;
    assert.ok(
      direction === "vertical"
        ? Math.abs(b.x - c.x) > planNodeSize.width
        : Math.abs(b.y - c.y) > planNodeSize.height,
    );
  }
});
