import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import {
  queryPositions,
  queryRoutes,
  queryNodeSize,
  graphPath,
  graphNodeContent,
  visibleGraph,
  type GraphData,
  type GraphNode as QueryNode,
} from "./sqlToolsModel";
import { downloadDiagram } from "./imageExport";
import QueryEdge from "./QueryEdge";
import {
  planPositions,
  planNodeSize,
  planCategory,
  planContext,
  planCardMetrics,
  planMetrics,
  planSignals,
} from "./planModel";
import { PlanOverview, PlanDetails, PlanTable } from "./PlanPresentation";
const edgeTypes = { query: QueryEdge };

function waitForExportNodes(
  container: HTMLElement,
  expected: number,
  expectedEdges: number,
) {
  return new Promise<void>((resolve, reject) => {
    let frame = 0;
    const timeout = setTimeout(() => {
      cancelAnimationFrame(frame);
      reject(new Error("Export nodes did not finish rendering."));
    }, 5000);
    const check = () => {
      if (!container.isConnected) {
        clearTimeout(timeout);
        reject(new Error("Graph closed during export."));
      } else if (
        container.querySelectorAll(".react-flow__node").length === expected &&
        container.querySelectorAll(".react-flow__edge").length === expectedEdges
      ) {
        clearTimeout(timeout);
        resolve();
      } else frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
  });
}

const GraphNode = memo(function GraphNode({ data }: NodeProps) {
  const content = graphNodeContent(data as unknown as QueryNode);
  const plan = data as unknown as QueryNode;
  const metrics = data.plan ? planMetrics(plan) : null;
  return (
    <div
      className={`sut-node sut-node-${data.kind} ${data.plan ? `sut-plan-node sut-plan-${planCategory(plan).split(" ")[0].toLowerCase()}` : ""} ${data.active ? "sut-node-active" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${data.label}`}
      aria-pressed={Boolean(data.active)}
      onClick={() => (data.inspect as () => void)()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          (data.inspect as () => void)();
        }
      }}
    >
      {(data.inputs as string[]).map((id, index, ids) => (
        <Handle
          key={id}
          id={`in-${id}`}
          type="target"
          position={data.vertical ? Position.Top : Position.Left}
          style={
            data.vertical
              ? { left: `${((index + 1) / (ids.length + 1)) * 100}%` }
              : { top: `${((index + 1) / (ids.length + 1)) * 100}%` }
          }
        />
      ))}
      <span className="sut-node-kind">
        {data.plan ? planCategory(plan) : content.category}
      </span>
      <strong title={content.title}>{content.title}</strong>
      {data.plan ? (
        <>
          {planContext(plan) && (
            <p title={planContext(plan)}>{planContext(plan)}</p>
          )}
          <dl className="sut-plan-card-metrics">
            {planCardMetrics(plan).map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          {(metrics?.never ||
            data.collapsed ||
            planSignals(plan).length > 0) && (
            <span className="sut-plan-status">
              {metrics?.never
                ? "Never executed"
                : data.collapsed
                  ? "Inputs collapsed"
                  : planSignals(plan)[0].title}
            </span>
          )}
        </>
      ) : (
        content.preview && <p title={content.preview}>{content.preview}</p>
      )}
      {(data.outputs as string[]).map((id, index, ids) => (
        <Handle
          key={id}
          id={`out-${id}`}
          type="source"
          position={data.vertical ? Position.Bottom : Position.Right}
          style={
            data.vertical
              ? { left: `${((index + 1) / (ids.length + 1)) * 100}%` }
              : { top: `${((index + 1) / (ids.length + 1)) * 100}%` }
          }
        />
      ))}
    </div>
  );
});
const nodeTypes = { tool: GraphNode };
export default function GraphViewer({
  graph,
  tree,
}: {
  graph: GraphData;
  tree: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null),
    [collapsed, setCollapsed] = useState(new Set<string>());
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null),
    [error, setError] = useState("");
  const [png, setPng] = useState<{ url: string; filename: string } | null>(
      null,
    ),
    [exporting, setExporting] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    "vertical",
  );
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(
    () => (tree ? visibleGraph(graph, collapsed) : graph),
    [graph, collapsed, tree],
  );
  const visibleNodes = useMemo(
    () => new Map(visible.nodes.map((node) => [node.id, node])),
    [visible],
  );
  const path = useMemo(() => graphPath(visible, selected), [visible, selected]);
  const positions = useMemo(
    () =>
      tree
        ? planPositions(visible, direction)
        : queryPositions(visible, direction),
    [visible, tree, direction],
  );
  const ports = useMemo(() => {
    const result = new Map(
      visible.nodes.map((n) => [
        n.id,
        { inputs: [] as string[], outputs: [] as string[] },
      ]),
    );
    for (const e of visible.edges) {
      result.get(e.target)?.inputs.push(e.id);
      result.get(e.source)?.outputs.push(e.id);
    }
    return result;
  }, [visible]);
  const routes = useMemo(
    () =>
      tree
        ? new Map<string, number>()
        : queryRoutes(visible, positions, direction),
    [visible, positions, direction, tree],
  );
  const nodeVariants = useMemo(
    () =>
      positions.map((n) => {
        const base = {
          ...n,
          type: "tool",
          width: tree ? planNodeSize.width : queryNodeSize.width,
          height: tree ? planNodeSize.height : queryNodeSize.height,
          selected: false,
          style: {
            width: tree ? planNodeSize.width : queryNodeSize.width,
            height: tree ? planNodeSize.height : queryNodeSize.height,
            opacity: 1,
          },
          data: {
            ...visibleNodes.get(n.id)!,
            ...ports.get(n.id)!,
            vertical: direction === "vertical",
            plan: tree,
            collapsed: collapsed.has(n.id),
            active: false,
            inspect: () => setSelected(n.id),
          },
        };
        return {
          normal: base,
          faded: { ...base, style: { ...base.style, opacity: 0.3 } },
          active: {
            ...base,
            selected: true,
            data: { ...base.data, active: true },
          },
        };
      }),
    [positions, visibleNodes, tree, direction, ports, collapsed],
  );
  const nodes = useMemo(
    () =>
      nodeVariants.map((n) =>
        n.normal.id === selected
          ? n.active
          : path.has(n.normal.id)
            ? n.normal
            : n.faded,
      ),
    [nodeVariants, selected, path],
  );
  const edgeVariants = useMemo(
    () =>
      visible.edges.map((e) => {
        const base = {
          ...e,
          sourceHandle: `out-${e.id}`,
          targetHandle: `in-${e.id}`,
          data: { lane: routes.get(e.id), vertical: direction === "vertical" },
          label: tree && e.label === "input" ? undefined : e.label,
          labelStyle: { fill: "#425b66", fontSize: 11, fontWeight: 500 },
          labelShowBg: true,
          labelBgStyle: { fill: "#ffffff", fillOpacity: 1, stroke: "#dce5e9" },
          labelBgPadding: [9, 5] as [number, number],
          labelBgBorderRadius: 5,
          pathOptions: { borderRadius: 14, offset: 32 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: e.back ? "#b1671e" : "#6d8c99",
          },
          style: {
            strokeDasharray:
              e.back || /reference|dependency|subquery/.test(e.label)
                ? "6 4"
                : undefined,
            stroke: e.back ? "#a56321" : "#6d8c99",
            strokeWidth: 1.5,
            opacity: 1,
          },
          type: tree ? "smoothstep" : "query",
        };
        return {
          normal: base,
          faded: { ...base, style: { ...base.style, opacity: 0.2 } },
          active: {
            ...base,
            style: {
              ...base.style,
              stroke: e.back ? "#a56321" : "#126e63",
              strokeWidth: 2.5,
            },
          },
        };
      }),
    [visible, tree, routes, direction],
  );
  const edges = useMemo(
    () =>
      edgeVariants.map((e) =>
        !selected
          ? e.normal
          : path.has(e.normal.source) && path.has(e.normal.target)
            ? e.active
            : e.faded,
      ),
    [edgeVariants, selected, path],
  );
  const node = graph.nodes.find((n) => n.id === selected);
  const searchIndex = useMemo(
    () =>
      graph.nodes.map((n) => ({
        node: n,
        text: `${n.label} ${graphNodeContent(n).preview} ${n.sql ?? ""} ${tree ? JSON.stringify(n.properties) : ""}`.toLowerCase(),
      })),
    [graph, tree],
  );
  const matches = useMemo(() => {
    const term = search.trim().toLowerCase();
    return searchIndex.filter((n) => n.text.includes(term)).map((n) => n.node);
  }, [searchIndex, search]);
  const focusNode = useCallback(
    (id: string) => {
      if (!visibleNodes.has(id)) {
        pendingFocus.current = id;
        setCollapsed(new Set());
      } else {
        void flow?.fitView({
          nodes: [{ id }],
          padding: 0.6,
          minZoom: 0.75,
          maxZoom: 1,
          duration: 250,
        });
      }
      setSelected(id);
    },
    [visibleNodes, flow],
  );
  const readableView = () => {
    if (!selected && flow) {
      const canvas = root.current?.querySelector<HTMLElement>(".sut-graph");
      const firstLayer = positions.filter((n) =>
        direction === "vertical" ? n.position.y === 0 : n.position.x === 0,
      );
      if (canvas && firstLayer.length) {
        const minX = Math.min(...firstLayer.map((n) => n.position.x));
        const minY = Math.min(...firstLayer.map((n) => n.position.y));
        const spanX =
          Math.max(...firstLayer.map((n) => n.position.x)) -
          minX +
          (tree ? planNodeSize.width : queryNodeSize.width);
        const spanY =
          Math.max(...firstLayer.map((n) => n.position.y)) -
          minY +
          (tree ? planNodeSize.height : queryNodeSize.height);
        const zoom = Math.min(
          0.9,
          Math.max(0.7, (canvas.clientWidth - 64) / spanX),
        );
        void flow.setViewport({
          zoom,
          x:
            (direction === "vertical"
              ? Math.max(32, (canvas.clientWidth - spanX * zoom) / 2)
              : 32) -
            minX * zoom,
          y:
            (direction === "vertical"
              ? 40
              : Math.max(40, (canvas.clientHeight - spanY * zoom) / 2)) -
            minY * zoom,
        });
        return;
      }
    }
    const target =
      positions.find((n) => n.id === selected) ??
      [...positions].sort((a, b) =>
        direction === "vertical"
          ? a.position.y - b.position.y || a.position.x - b.position.x
          : a.position.x - b.position.x || a.position.y - b.position.y,
      )[0];
    if (target)
      void flow?.fitView({
        nodes: [{ id: target.id }],
        padding: 0.6,
        minZoom: 0.75,
        maxZoom: 0.9,
      });
  };
  useEffect(() => {
    setSelected(null);
    pendingFocus.current = null;
    setCollapsed((old) => (old.size ? new Set() : old));
    setPng(null);
    setSearch("");
    setError("");
  }, [graph]);
  useEffect(() => {
    if (!flow) return;
    const frame = requestAnimationFrame(() => {
      readableView();
    });
    return () => cancelAnimationFrame(frame);
  }, [flow, graph, direction, tree]);
  useEffect(() => {
    const id = pendingFocus.current;
    if (!id || !flow || !visibleNodes.has(id)) return;
    const frame = requestAnimationFrame(() => {
      pendingFocus.current = null;
      void flow.fitView({
        nodes: [{ id }],
        padding: 0.6,
        minZoom: 0.75,
        maxZoom: 0.9,
        duration: 250,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [flow, visibleNodes]);
  return (
    <section
      className={`sut-graph-section ${expanded ? "sut-graph-expanded" : ""}`}
      ref={root}
      aria-label={tree ? "Execution plan graph" : "SQL query graph"}
    >
      <div className="sut-graph-heading">
        <div>
          <h3>{tree ? "Execution plan" : "Query flow"}</h3>
          <p>
            {tree
              ? "Follow parent steps to their inputs. Select a step to inspect estimates and execution metrics."
              : "Follow the arrows from source tables to the returned rows."}
          </p>
        </div>
        <span>
          {visible.nodes.length} {tree ? "steps" : "nodes"} ·{" "}
          {visible.edges.length} connections
        </span>
      </div>
      {tree && <PlanOverview graph={graph} focus={focusNode} />}
      <div className="sut-actions sut-graph-actions">
        {
          <label>
            Layout{" "}
            <select
              aria-label="Graph layout"
              value={direction}
              onChange={(e) => setDirection(e.target.value as typeof direction)}
            >
              <option value="vertical">Top to bottom</option>
              <option value="horizontal">Left to right</option>
            </select>
          </label>
        }
        <button onClick={() => flow?.fitView({ padding: 0.15 })}>
          Fit graph
        </button>
        <button onClick={readableView}>Readable view</button>
        <button aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Compact canvas" : "Expand canvas"}
        </button>
        {selected && (
          <button onClick={() => setSelected(null)}>Clear selection</button>
        )}
        {tree && (
          <button onClick={() => setCollapsed(new Set())}>Expand all</button>
        )}
        <button
          disabled={!flow || exporting}
          onClick={async () => {
            if (!root.current || !flow) return;
            setExporting(true);
            setError("");
            try {
              await waitForExportNodes(
                root.current,
                nodes.length,
                edges.length,
              );
              setPng(
                await downloadDiagram(
                  root.current,
                  flow,
                  tree ? "explain-plan" : "sql-structure",
                ),
              );
            } catch {
              setError("PNG export failed. Try a smaller graph.");
            } finally {
              setExporting(false);
            }
          }}
        >
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
        {tree && <span>Export includes currently expanded nodes.</span>}
      </div>
      {!tree && (
        <div className="sut-graph-legend" aria-label="Graph legend">
          <span className="sut-legend-source">Tables</span>
          <span className="sut-legend-cte">CTEs / subqueries</span>
          <span className="sut-legend-transform">Query operations</span>
          <span className="sut-legend-result">Result</span>
          <span>Dashed arrows: references / dependencies</span>
          <span>Select a node to trace its inputs and outputs.</span>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      {png && (
        <details>
          <summary>PNG ready - preview or save</summary>
          <a href={png.url} download={png.filename}>
            Save PNG
          </a>
          <img
            className="sut-preview"
            src={png.url}
            alt="Graph export preview"
          />
        </details>
      )}
      <div className="sut-graph-workspace">
        <div className="sut-graph">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={setFlow}
            onNodeClick={(_, n) => setSelected(n.id)}
            onPaneClick={() => setSelected(null)}
            nodesDraggable={false}
            nodesConnectable={false}
            onlyRenderVisibleElements={tree && !exporting}
            deleteKeyCode={null}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSelected(null);
            }}
            minZoom={0.02}
            maxZoom={2}
          >
            <Background gap={24} size={1} color="#d4e0e3" />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) =>
                n.data.kind === "output"
                  ? "#126e63"
                  : String(n.data.kind).startsWith("cte")
                    ? "#8671aa"
                    : "#85aab8"
              }
            />
          </ReactFlow>
        </div>
        <aside
          className="sut-graph-inspector"
          aria-label={tree ? "Plan inspector" : "Query inspector"}
        >
          <label className="sut-graph-search">
            Find a step
            <input
              type="search"
              placeholder={
                tree
                  ? "Operator, table, index, or condition"
                  : "Table, clause, or expression"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <details
            className="sut-graph-outline"
            open={!node || Boolean(search)}
          >
            <summary>
              {tree ? "Plan steps" : "Query steps"} ({matches.length})
            </summary>
            <div className="sut-step-list">
              {matches.map((n) => {
                const content = graphNodeContent(n);
                return (
                  <button
                    key={n.id}
                    aria-pressed={n.id === selected}
                    onClick={() => focusNode(n.id)}
                  >
                    <span>{tree ? planCategory(n) : content.category}</span>
                    <strong>{content.title}</strong>
                  </button>
                );
              })}
              {!matches.length && (
                <p role="status">
                  No matching steps. Try a table name or SQL keyword.
                </p>
              )}
            </div>
          </details>
          <div className="sut-node-details">
            {node ? (
              <>
                <h3>{node.label}</h3>
                {tree && <PlanDetails node={node} />}
                {node.kind === "select" &&
                  Array.isArray(node.properties.columns) && (
                    <>
                      <h4>Selected expressions</h4>
                      <ul className="sut-expression-list">
                        {node.properties.columns.map((column, i) => (
                          <li key={i}>
                            <code>{String(column)}</code>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                {node.kind === "join" && (
                  <>
                    <h4>Join condition</h4>
                    <pre>
                      {String(node.properties.condition ?? "No join predicate")}
                    </pre>
                  </>
                )}
                {tree && graph.edges.some((e) => e.source === node.id) && (
                  <button
                    onClick={() =>
                      setCollapsed((old) => {
                        const next = new Set(old);
                        if (next.has(node.id)) next.delete(node.id);
                        else next.add(node.id);
                        return next;
                      })
                    }
                  >
                    {collapsed.has(node.id)
                      ? "Expand inputs"
                      : "Collapse inputs"}
                  </button>
                )}
                {Object.keys(node.properties).length > 0 && (
                  <details>
                    <summary>All properties</summary>
                    <pre>{JSON.stringify(node.properties, null, 2)}</pre>
                  </details>
                )}
                {node.sql && (
                  <>
                    <h4>SQL for this step</h4>
                    <pre>{node.sql}</pre>
                  </>
                )}
                <h4>{tree ? "Connected steps" : "Inputs and outputs"}</h4>
                <div className="sut-connected-list">
                  {visible.edges
                    .filter((e) => e.target === node.id || e.source === node.id)
                    .map((e) => {
                      const input = e.target === node.id,
                        other = visibleNodes.get(input ? e.source : e.target);
                      return other ? (
                        <button key={e.id} onClick={() => focusNode(other.id)}>
                          <span>
                            {tree
                              ? input
                                ? "Parent"
                                : "Input"
                              : input
                                ? "Input"
                                : "Output"}
                            {e.label ? ` · ${e.label}` : ""}
                          </span>
                          {graphNodeContent(other).title}
                        </button>
                      ) : null;
                    })}
                </div>
              </>
            ) : (
              <p className="sut-inspector-hint">
                {tree
                  ? "Choose a step to compare estimated and actual rows, inspect timing, buffers, and conditions."
                  : "Choose a step in the graph or list to see its SQL and connections."}
              </p>
            )}
          </div>
        </aside>
      </div>
      {tree && <PlanTable graph={graph} focus={focusNode} />}
      {graph.summary && (
        <details>
          <summary>Supplied summary and extra properties</summary>
          <pre>{JSON.stringify(graph.summary, null, 2)}</pre>
        </details>
      )}
    </section>
  );
}
