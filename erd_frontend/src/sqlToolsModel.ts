export type Settings = {
  dialect: string;
  target: string;
  keywordCase: "preserve" | "upper" | "lower";
  tabWidth: 2 | 4;
  lineLength: 80 | 88 | 100 | 120;
  planFormat: "auto" | "json" | "text";
  statement: number;
};
export const defaults: Settings = {
  dialect: "postgres",
  target: "bigquery",
  keywordCase: "upper",
  tabWidth: 2,
  lineLength: 88,
  planFormat: "auto",
  statement: 1,
};
export type WorkspaceFile = {
  format: "constructor-sql-workspace";
  version: 1;
  sql: string;
  plan: string;
  settings: Settings;
};
export function readWorkspace(raw: string, dialects: string[]): WorkspaceFile {
  if (new TextEncoder().encode(raw).length > 3000000)
    throw new Error("Workspace exceeds 3 MB.");
  const value = JSON.parse(raw);
  if (
    value?.format !== "constructor-sql-workspace" ||
    value.version !== 1 ||
    typeof value.sql !== "string" ||
    value.sql.length > 200000 ||
    typeof value.plan !== "string" ||
    new TextEncoder().encode(value.plan).length > 2000000
  )
    throw new Error("Invalid SQL workspace file.");
  const s = value.settings;
  if (
    !s ||
    !dialects.includes(s.dialect) ||
    !dialects.includes(s.target) ||
    !["preserve", "upper", "lower"].includes(s.keywordCase) ||
    ![2, 4].includes(s.tabWidth) ||
    (s.lineLength !== undefined &&
      ![80, 88, 100, 120].includes(s.lineLength)) ||
    !["auto", "json", "text"].includes(s.planFormat) ||
    !Number.isInteger(s.statement) ||
    s.statement < 1
  )
    throw new Error("Invalid workspace settings.");
  return {
    format: "constructor-sql-workspace",
    version: 1,
    sql: value.sql,
    plan: value.plan,
    settings: {
      dialect: s.dialect,
      target: s.target,
      keywordCase: s.keywordCase,
      tabWidth: s.tabWidth,
      lineLength: s.lineLength ?? 88,
      planFormat: s.planFormat,
      statement: s.statement,
    },
  };
}
export function responseMatches(
  response: { workspaceId: string; id: string; revision: number },
  workspace: string,
  pending: string | null,
  revision: number,
) {
  return (
    response.workspaceId === workspace &&
    response.id === pending &&
    response.revision === revision
  );
}
export type GraphNode = {
  id: string;
  label: string;
  kind: string;
  properties: Record<string, unknown>;
  sql?: string;
};
export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  back?: boolean;
};
export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  diagnostics: string[];
  summary?: Record<string, unknown>;
  statementCount?: number;
};
export function graphPositions(graph: GraphData, tree = false) {
  const forward = new Map(graph.nodes.map((node) => [node.id, [] as string[]]));
  const indegree = new Map(graph.nodes.map((node) => [node.id, 0]));
  for (const edge of graph.edges) {
    if (edge.back || !forward.has(edge.source) || !indegree.has(edge.target))
      continue;
    forward.get(edge.source)!.push(edge.target);
    indegree.set(edge.target, indegree.get(edge.target)! + 1);
  }
  if (tree) {
    const positions = new Map<string, { x: number; y: number }>();
    let row = 0;
    const place = (id: string, depth: number): number => {
      const existing = positions.get(id);
      if (existing) return existing.y;
      positions.set(id, { x: depth * 420, y: row * 160 });
      const childRows = (forward.get(id) ?? []).map((child) =>
        place(child, depth + 1),
      );
      const y = childRows.length
        ? (childRows[0] + childRows[childRows.length - 1]) / 2
        : row++ * 160;
      positions.set(id, { x: depth * 420, y });
      return y;
    };
    graph.nodes
      .filter((node) => !indegree.get(node.id))
      .forEach((node) => place(node.id, 0));
    return graph.nodes.map((node) => ({
      id: node.id,
      position: positions.get(node.id) ?? { x: 0, y: 0 },
    }));
  }
  const levels = new Map(graph.nodes.map((n) => [n.id, 0]));
  const queue = graph.nodes
    .filter((node) => !indegree.get(node.id))
    .map((node) => node.id);
  for (let index = 0; index < queue.length; index++) {
    const source = queue[index];
    for (const target of forward.get(source) ?? []) {
      levels.set(
        target,
        Math.max(levels.get(target)!, levels.get(source)! + 1),
      );
      indegree.set(target, indegree.get(target)! - 1);
      if (!indegree.get(target)) queue.push(target);
    }
  }
  const rows = new Map<number, number>();
  return graph.nodes.map((n) => {
    const level = levels.get(n.id) ?? 0;
    const row = rows.get(level) ?? 0;
    rows.set(level, row + 1);
    return { id: n.id, position: { x: level * 420, y: row * 160 } };
  });
}

export const queryNodeSize = { width: 280, height: 144 };

export function queryRoutes(
  graph: GraphData,
  positions: { id: string; position: { x: number; y: number } }[],
  direction: "vertical" | "horizontal",
) {
  const byId = new Map(positions.map((n) => [n.id, n.position]));
  const vertical = direction === "vertical";
  const crossAxis = vertical ? "x" : "y",
    axis = vertical ? "y" : "x";
  const crossSize = vertical ? queryNodeSize.width : queryNodeSize.height;
  const gap = vertical ? queryNodeSize.height + 88 : queryNodeSize.width + 140;
  const min = Math.min(0, ...positions.map((n) => n.position[crossAxis]));
  const max = Math.max(
    0,
    ...positions.map((n) => n.position[crossAxis] + crossSize),
  );
  const lanes = new Map<string, number>();
  let left = 0,
    right = 0;
  for (const edge of graph.edges) {
    const source = byId.get(edge.source),
      target = byId.get(edge.target);
    if (
      !source ||
      !target ||
      (!edge.back && target[axis] - source[axis] <= gap * 1.5)
    )
      continue;
    const center = (source[crossAxis] + target[crossAxis] + crossSize) / 2;
    lanes.set(
      edge.id,
      center - min <= max - center
        ? min - 36 - left++ * 18
        : max + 36 + right++ * 18,
    );
  }
  return lanes;
}

/** Order adjacent layers to keep query branches together without overlapping. */
export function queryPositions(
  graph: GraphData,
  direction: "vertical" | "horizontal" = "vertical",
) {
  const ranked = graphPositions(graph);
  const levels = new Map(
    ranked.map((node) => [node.id, node.position.x / 420]),
  );
  const layers = new Map<number, string[]>();
  const before = new Map(graph.nodes.map((node) => [node.id, [] as string[]]));
  const after = new Map(graph.nodes.map((node) => [node.id, [] as string[]]));
  for (const node of graph.nodes) {
    const rank = levels.get(node.id)!;
    if (!layers.has(rank)) layers.set(rank, []);
    layers.get(rank)!.push(node.id);
  }
  for (const edge of graph.edges) {
    if (edge.back || !before.has(edge.target) || !after.has(edge.source))
      continue;
    before.get(edge.target)!.push(edge.source);
    after.get(edge.source)!.push(edge.target);
  }
  const ranks = [...layers.keys()].sort((a, b) => a - b);
  const order = new Map<string, number>();
  const refresh = () => {
    for (const ids of layers.values())
      ids.forEach((id, index) => order.set(id, index - (ids.length - 1) / 2));
  };
  refresh();
  for (let pass = 0; pass < 4; pass++) {
    const neighbors = pass % 2 === 0 ? before : after;
    for (const rank of pass % 2 === 0 ? ranks : [...ranks].reverse()) {
      const score = (id: string) => {
        const connected = neighbors.get(id)!;
        return connected.length
          ? connected.reduce((sum, n) => sum + order.get(n)!, 0) /
              connected.length
          : order.get(id)!;
      };
      layers.get(rank)!.sort((a, b) => score(a) - score(b));
      refresh();
    }
  }
  const widest = Math.max(1, ...[...layers.values()].map((ids) => ids.length));
  const positions = new Map<string, { x: number; y: number }>();
  for (const [rank, ids] of layers) {
    ids.forEach((id, index) => {
      const lane = index + (widest - ids.length) / 2;
      positions.set(
        id,
        direction === "vertical"
          ? {
              x: lane * (queryNodeSize.width + 68),
              y: rank * (queryNodeSize.height + 88),
            }
          : {
              x: rank * (queryNodeSize.width + 140),
              y: lane * (queryNodeSize.height + 68),
            },
      );
    });
  }
  return graph.nodes.map((node) => ({
    id: node.id,
    position: positions.get(node.id)!,
  }));
}

/** Upstream and downstream paths, including recursive CTEs without looping. */
export function graphPath(graph: GraphData, selected: string | null) {
  if (!selected) return new Set(graph.nodes.map((node) => node.id));
  const upstream = new Map<string, string[]>(),
    downstream = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (!upstream.has(edge.target)) upstream.set(edge.target, []);
    if (!downstream.has(edge.source)) downstream.set(edge.source, []);
    upstream.get(edge.target)!.push(edge.source);
    downstream.get(edge.source)!.push(edge.target);
  }
  const path = new Set([selected]);
  for (const adjacency of [upstream, downstream]) {
    const seen = new Set([selected]),
      stack = [selected];
    while (stack.length) {
      for (const next of adjacency.get(stack.pop()!) ?? []) {
        if (seen.has(next)) continue;
        seen.add(next);
        path.add(next);
        stack.push(next);
      }
    }
  }
  return path;
}

export function graphNodeContent(node: GraphNode) {
  const category =
    (
      {
        table: "Table",
        source: "Source",
        "cte-reference": "CTE reference",
        cte: "CTE definition",
        subquery: "Subquery",
        join: "Join",
        set: "Set operation",
        operation: "Transform",
        select: "Projection",
        output: "Result",
        plan: "Plan step",
        "plan-group": "Plan group",
      } as Record<string, string>
    )[node.kind] ?? node.kind;
  const columns = node.properties.columns;
  let preview = "";
  if (node.kind === "select" && Array.isArray(columns))
    preview = columns.map(String).join(", ");
  else if (node.kind === "join")
    preview = String(node.properties.condition ?? "");
  else if (node.kind === "table" || node.kind === "cte-reference")
    preview = node.properties.alias ? `Alias: ${node.properties.alias}` : "";
  else if (node.kind === "cte")
    preview = node.properties.recursive
      ? "Recursive common table expression"
      : "Named query reused below";
  else if (node.kind === "set")
    preview = `Duplicates ${node.properties.duplicates ?? "unspecified"}`;
  else if (node.kind === "operation") preview = node.sql ?? "";
  else if (node.kind === "output") preview = "Rows returned by this statement";
  else if (node.kind.startsWith("plan"))
    preview = [
      node.properties["Relation Name"],
      node.properties["Index Name"],
      node.properties["Plan Rows"] !== undefined
        ? `${node.properties["Plan Rows"]} estimated rows`
        : "",
    ]
      .filter(Boolean)
      .join(" · ");
  else if (node.kind === "subquery") preview = "Nested query result";
  return {
    category,
    title: node.label,
    preview: preview.replace(/\s+/g, " ").trim(),
  };
}
export function visibleGraph(graph: GraphData, collapsed: Set<string>) {
  // Plan edges point from parents to their inputs. Collapse only in tree mode.
  const hidden = new Set<string>();
  const children = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (edge.back) continue;
    if (!children.has(edge.source)) children.set(edge.source, []);
    children.get(edge.source)!.push(edge.target);
  }
  const stack = [...collapsed].flatMap((id) => children.get(id) ?? []);
  while (stack.length) {
    const id = stack.pop()!;
    if (!hidden.has(id)) {
      hidden.add(id);
      stack.push(...(children.get(id) ?? []));
    }
  }
  return {
    ...graph,
    nodes: graph.nodes.filter((n) => !hidden.has(n.id)),
    edges: graph.edges.filter(
      (e) => !hidden.has(e.source) && !hidden.has(e.target),
    ),
  };
}
