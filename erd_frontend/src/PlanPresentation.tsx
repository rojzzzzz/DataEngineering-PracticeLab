import { memo, useMemo, useState } from "react";
import type { GraphData, GraphNode } from "./sqlToolsModel";
import {
  formatMetric,
  planOverview,
  planMetrics,
  planSignals,
  planMetricRows,
  planConditions,
  planContext,
} from "./planModel";

export const PlanOverview = memo(function PlanOverview({
  graph,
  focus,
}: {
  graph: GraphData;
  focus: (id: string) => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const signals = useMemo(() => graph.nodes.flatMap(planSignals), [graph]);
  const labels = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n.label])),
    [graph],
  );
  return (
    <div className="sut-plan-overview">
      {planOverview(graph).map((p) => (
        <div key={p.nodeId} className="sut-plan-summary">
          <strong>
            {p.label} ·{" "}
            {p.metrics.actual !== undefined || p.execution !== undefined
              ? "Measured execution"
              : "Estimates only"}
          </strong>
          <dl className="sut-plan-metrics">
            <div>
              <dt>Execution time</dt>
              <dd>{formatMetric(p.execution, "ms")}</dd>
            </div>
            <div>
              <dt>Planning time</dt>
              <dd>{formatMetric(p.planning, "ms")}</dd>
            </div>
            <div>
              <dt>Root estimated cost</dt>
              <dd>{formatMetric(p.metrics.cost)}</dd>
            </div>
            <div>
              <dt>Root estimated rows</dt>
              <dd>{formatMetric(p.metrics.estimated)}</dd>
            </div>
            <div>
              <dt>Root rows / loop</dt>
              <dd>{formatMetric(p.metrics.actual)}</dd>
            </div>
          </dl>
        </div>
      ))}
      <p className="sut-plan-note">
        — means not supplied. Costs are planner units. Actual rows and times are
        averages per loop; node timings and buffer counts include inputs and
        must not be added together.
      </p>
      {signals.length > 0 && (
        <details
          className="sut-plan-review"
          onToggle={(event) => setReviewOpen(event.currentTarget.open)}
        >
          <summary>Review points ({signals.length})</summary>
          <p className="sut-plan-note">
            These are observations to inspect in context, not automatic
            diagnoses.
          </p>
          {reviewOpen &&
            signals.map((s, i) => (
              <button key={`${s.nodeId}-${i}`} onClick={() => focus(s.nodeId)}>
                <strong>{s.title}</strong>
                <span>
                  {labels.get(s.nodeId)} · {s.detail}
                </span>
              </button>
            ))}
        </details>
      )}
    </div>
  );
});

export function PlanDetails({ node }: { node: GraphNode }) {
  const m = planMetrics(node),
    conditions = planConditions(node);
  return (
    <>
      {planContext(node) && <p>{planContext(node)}</p>}
      {node.properties["Sort Method"] !== undefined && (
        <p className="sut-plan-note">
          Sort method: {String(node.properties["Sort Method"])}
          {node.properties["Sort Space Type"]
            ? ` · ${String(node.properties["Sort Space Type"])}`
            : ""}
        </p>
      )}
      {m.never && <p className="sut-plan-status">Never executed</p>}
      <dl className="sut-plan-detail-metrics">
        {planMetricRows(node).map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {m.cumulative !== undefined && (
        <p className="sut-plan-note">
          Inclusive time × loops: {formatMetric(m.cumulative, "ms")}. Includes
          child work; this is not exclusive time.
        </p>
      )}
      {conditions.map((c) => (
        <div key={c.label}>
          <h4>{c.label}</h4>
          <pre>{c.value}</pre>
        </div>
      ))}
      {planSignals(node).map((s) => (
        <p className="sut-plan-note" key={s.title}>
          <strong>{s.title}.</strong> {s.detail}
        </p>
      ))}
    </>
  );
}

export const PlanTable = memo(function PlanTable({
  graph,
  focus,
}: {
  graph: GraphData;
  focus: (id: string) => void;
}) {
  const [sort, setSort] = useState("order");
  const [open, setOpen] = useState(false);
  const nodes = [...graph.nodes];
  if (sort !== "order")
    nodes.sort(
      (a, b) =>
        (planMetrics(b)[sort as "cumulative" | "cost"] ?? -1) -
        (planMetrics(a)[sort as "cumulative" | "cost"] ?? -1),
    );
  return (
    <details
      className="sut-plan-table"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>Compare all plan steps ({nodes.length})</summary>
      {open && (
        <>
          <label>
            Order{" "}
            <select
              aria-label="Plan table order"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="order">Plan order</option>
              <option value="cumulative">Inclusive time × loops</option>
              <option value="cost">Estimated cost</option>
            </select>
          </label>
          <p className="sut-plan-note">
            Time columns include input work. A high estimate or inclusive time
            alone does not identify the cause of slow execution.
          </p>
          <div className="sut-plan-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Est. rows</th>
                  <th>Rows / loop</th>
                  <th>Loops</th>
                  <th>Time / loop (ms)</th>
                  <th>Time × loops (ms)</th>
                  <th>Est. cost</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n) => {
                  const m = planMetrics(n);
                  return (
                    <tr key={n.id}>
                      <th>
                        <button onClick={() => focus(n.id)}>{n.label}</button>
                        {m.never && <small>Never executed</small>}
                      </th>
                      <td>{formatMetric(m.estimated)}</td>
                      <td>{formatMetric(m.actual)}</td>
                      <td>{formatMetric(m.loops)}</td>
                      <td>{formatMetric(m.time)}</td>
                      <td>{formatMetric(m.cumulative)}</td>
                      <td>{formatMetric(m.cost)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </details>
  );
});
