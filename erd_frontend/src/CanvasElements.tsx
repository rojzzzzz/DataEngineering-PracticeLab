import {
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { Entity, Relationship } from "./model";
import { memo } from "react";
import { StrokeNode } from "./Drawing";

function EntityNode({
  data,
}: {
  data: { entity: Entity; readOnly?: boolean };
}) {
  const e = data.entity;
  return (
    <div className={`erd-node erd-node-${e.role}`}>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <div className="erd-node-heading">
        <small>{e.role}</small>
        <strong>{e.name || "Untitled"}</strong>
      </div>
      {e.annotation && (
        <div className="erd-node-note" title={e.annotation}>
          {e.annotation}
        </div>
      )}
      {!e.fields.length && (
        <div className="erd-node-empty">
          {data.readOnly ? "No fields saved" : "Select to add fields"}
        </div>
      )}
      {e.fields.map((f) => (
        <div className="erd-node-field" key={f.id}>
          <span>
            <span className={`erd-key ${f.pk || f.fk ? "erd-key-set" : ""}`}>
              {[f.pk && "PK", f.fk && "FK"].filter(Boolean).join(" ") || "·"}
            </span>
            {f.name}
          </span>
          <small>{f.data_type}</small>
        </div>
      ))}
    </div>
  );
}

const endText = (optional: boolean, cardinality: string) =>
  optional
    ? cardinality === "many"
      ? "0..*"
      : "0..1"
    : cardinality === "many"
      ? "1..*"
      : "1";
function RelationEdge(props: EdgeProps) {
  const [path, labelX, labelY] = getBezierPath(props);
  const relation = props.data?.relation as Relationship | undefined;
  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={
          relation?.target_cardinality === "many"
            ? "url(#erd-crowfoot)"
            : "url(#erd-one)"
        }
        markerStart={
          relation?.source_cardinality === "many"
            ? "url(#erd-crowfoot-start)"
            : "url(#erd-one-start)"
        }
        style={{
          stroke: props.selected ? "#0b766e" : "#8597a5",
          strokeWidth: props.selected ? 3 : 1.6,
        }}
      />
      {relation && (
        <EdgeLabelRenderer>
          <div
            className={`erd-edge-label ${props.selected ? "selected" : ""}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {relation.label || "relationship"} ·{" "}
            {endText(relation.source_optional, relation.source_cardinality)} :{" "}
            {endText(relation.target_optional, relation.target_cardinality)}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
export const nodeTypes = { entity: memo(EntityNode), stroke: memo(StrokeNode) };
export const edgeTypes = { relation: memo(RelationEdge) };
