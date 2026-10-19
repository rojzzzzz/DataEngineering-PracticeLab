import {
  graphPositions,
  type GraphData,
  type GraphNode,
} from "./sqlToolsModel.ts";

export const planNodeSize = { width: 300, height: 208 };
export function planPositions(
  graph: GraphData,
  direction: "vertical" | "horizontal",
) {
  return graphPositions(graph, true).map((n) => ({
    id: n.id,
    position:
      direction === "vertical"
        ? {
            x: (n.position.y / 160) * (planNodeSize.width + 64),
            y: (n.position.x / 420) * (planNodeSize.height + 88),
          }
        : {
            x: (n.position.x / 420) * (planNodeSize.width + 140),
            y: (n.position.y / 160) * (planNodeSize.height + 64),
          },
  }));
}
export function planNumber(
  properties: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = properties[key];
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}
const metricFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
});
export const formatMetric = (value: number | undefined, unit = "") =>
  value === undefined
    ? "—"
    : `${metricFormatter.format(value)}${unit ? ` ${unit}` : ""}`;

export function planMetrics(node: GraphNode) {
  const p = node.properties;
  const estimated = planNumber(p, "Plan Rows"),
    actual = planNumber(p, "Actual Rows");
  const loops = planNumber(p, "Actual Loops"),
    time = planNumber(p, "Actual Total Time");
  const never = p["Never Executed"] === true || loops === 0;
  const cumulative =
    !never &&
    loops !== undefined &&
    Number.isInteger(loops) &&
    time !== undefined &&
    Number.isFinite(time * loops)
      ? time * loops
      : undefined;
  const factor =
    !never &&
    estimated !== undefined &&
    estimated > 0 &&
    actual !== undefined &&
    actual > 0
      ? Math.max(actual / estimated, estimated / actual)
      : undefined;
  return {
    estimated,
    actual,
    loops,
    time,
    cumulative,
    factor,
    never,
    cost: planNumber(p, "Total Cost"),
    startupCost: planNumber(p, "Startup Cost"),
    startupTime: planNumber(p, "Actual Startup Time"),
  };
}

export function planCategory(node: GraphNode) {
  const type = String(node.properties["Node Type"] ?? node.label);
  if (/Scan|Bitmap/.test(type)) return "Scan";
  if (/Join|Nested Loop/.test(type)) return "Join";
  if (/Sort|Aggregate|Group|Unique|Window/.test(type))
    return "Sort / aggregate";
  if (/Gather/.test(type)) return "Parallel";
  if (/Hash|Materialize|Memoize/.test(type)) return "Intermediate";
  return node.kind === "plan-group" ? "Subplan" : "Plan step";
}
export function planContext(node: GraphNode) {
  const p = node.properties;
  return [
    p["Relation Name"]
      ? `${p["Schema"] ? `${p["Schema"]}.` : ""}${p["Relation Name"]}${p.Alias ? ` AS ${p.Alias}` : ""}`
      : "",
    p["Index Name"] ? `Index: ${p["Index Name"]}` : "",
    p["CTE Name"] ? `CTE: ${p["CTE Name"]}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
export function planConditions(node: GraphNode) {
  return [
    "Index Cond",
    "Recheck Cond",
    "Hash Cond",
    "Merge Cond",
    "Join Filter",
    "Filter",
    "Sort Key",
    "Group Key",
  ]
    .filter((key) => node.properties[key] !== undefined)
    .map((key) => ({
      label: key,
      value: Array.isArray(node.properties[key])
        ? (node.properties[key] as unknown[]).map(String).join(", ")
        : String(node.properties[key]),
    }));
}
export function planCardMetrics(node: GraphNode) {
  const m = planMetrics(node),
    values: { label: string; value: string }[] = [];
  if (m.time !== undefined && !m.never)
    values.push({ label: "Time / loop", value: formatMetric(m.time, "ms") });
  else if (m.cost !== undefined)
    values.push({ label: "Estimated cost", value: formatMetric(m.cost) });
  if (m.estimated !== undefined)
    values.push({ label: "Estimated rows", value: formatMetric(m.estimated) });
  if (m.actual !== undefined && !m.never)
    values.push({ label: "Rows / loop", value: formatMetric(m.actual) });
  if (m.loops !== undefined)
    values.push({ label: "Loops", value: formatMetric(m.loops) });
  return values;
}
export type PlanSignal = {
  nodeId: string;
  title: string;
  detail: string;
  kind: "estimate" | "disk" | "batches";
};
export function planSignals(node: GraphNode): PlanSignal[] {
  const m = planMetrics(node),
    p = node.properties,
    signals: PlanSignal[] = [];
  if (m.factor !== undefined && m.factor >= 10)
    signals.push({
      nodeId: node.id,
      kind: "estimate",
      title: `${formatMetric(m.factor)}× row estimate difference`,
      detail: `Estimated ${formatMetric(m.estimated)} rows; returned ${formatMetric(m.actual)} per loop. Partial execution, including LIMIT, can affect this comparison.`,
    });
  else if (
    !m.never &&
    m.estimated === 0 &&
    m.actual !== undefined &&
    m.actual > 0
  )
    signals.push({
      nodeId: node.id,
      kind: "estimate",
      title: "Rows returned against a zero estimate",
      detail: `Returned ${formatMetric(m.actual)} rows per loop; estimated zero. Inspect this step in context.`,
    });
  if (String(p["Sort Space Type"]).toLowerCase() === "disk")
    signals.push({
      nodeId: node.id,
      kind: "disk",
      title: "Sort used disk",
      detail:
        planNumber(p, "Sort Space Used") !== undefined
          ? `${formatMetric(planNumber(p, "Sort Space Used"), "kB")} of sort space reported on disk.`
          : "The plan reports disk sort space.",
    });
  const tempRead = planNumber(p, "Temp Read Blocks"),
    tempWritten = planNumber(p, "Temp Written Blocks");
  if ((tempRead ?? 0) > 0 || (tempWritten ?? 0) > 0)
    signals.push({
      nodeId: node.id,
      kind: "disk",
      title: "Temporary buffer I/O",
      detail: `Temp blocks read: ${formatMetric(tempRead)}; written: ${formatMetric(tempWritten)}. Counts include child steps and are not summed.`,
    });
  const batches = planNumber(p, "Hash Batches");
  if (batches !== undefined && batches > 1)
    signals.push({
      nodeId: node.id,
      kind: "batches",
      title: `Hash used ${formatMetric(batches)} batches`,
      detail: "Inspect hash memory and temporary I/O for this step.",
    });
  return signals;
}
export function planOverview(graph: GraphData) {
  const targets = new Set(
    graph.edges.filter((e) => !e.back).map((e) => e.target),
  );
  const roots = graph.nodes.filter((n) => !targets.has(n.id));
  return roots.map((node, i) => {
    const raw = graph.summary?.[`Plan ${i + 1}`];
    const summary =
      raw && typeof raw === "object" && !Array.isArray(raw)
        ? (raw as Record<string, unknown>)
        : {};
    return {
      label: `Plan ${i + 1}`,
      nodeId: node.id,
      metrics: planMetrics(node),
      execution: planNumber(summary, "Execution Time"),
      planning: planNumber(summary, "Planning Time"),
    };
  });
}
export function planMetricRows(node: GraphNode) {
  const p = node.properties;
  return [
    ["Startup Cost", "Estimated startup cost", ""],
    ["Total Cost", "Estimated total cost", ""],
    ["Plan Rows", "Estimated rows", ""],
    ["Plan Width", "Estimated row width", "bytes"],
    ["Actual Startup Time", "Startup time / loop", "ms"],
    ["Actual Total Time", "Total time / loop", "ms"],
    ["Actual Rows", "Rows returned / loop", ""],
    ["Actual Loops", "Loops", ""],
    ["Rows Removed by Filter", "Rows removed by filter / loop", ""],
    ["Rows Removed by Join Filter", "Rows removed by join filter / loop", ""],
    ["Heap Fetches", "Heap fetches", ""],
    ["Workers Planned", "Workers planned", ""],
    ["Workers Launched", "Workers launched", ""],
    ["Shared Hit Blocks", "Shared blocks hit", ""],
    ["Shared Read Blocks", "Shared blocks read", ""],
    ["Shared Dirtied Blocks", "Shared blocks dirtied", ""],
    ["Shared Written Blocks", "Shared blocks written", ""],
    ["Local Hit Blocks", "Local blocks hit", ""],
    ["Local Read Blocks", "Local blocks read", ""],
    ["Local Dirtied Blocks", "Local blocks dirtied", ""],
    ["Local Written Blocks", "Local blocks written", ""],
    ["Temp Read Blocks", "Temp blocks read", ""],
    ["Temp Written Blocks", "Temp blocks written", ""],
    ["Sort Space Used", "Sort space", "kB"],
    ["Peak Memory Usage", "Peak memory", "kB"],
    ["Hash Batches", "Hash batches", ""],
    ["Hash Buckets", "Hash buckets", ""],
  ]
    .filter(([key]) => planNumber(p, key) !== undefined)
    .map(([key, label, unit]) => ({
      label,
      value: formatMetric(planNumber(p, key), unit),
    }));
}
