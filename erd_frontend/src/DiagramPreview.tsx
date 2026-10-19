import { useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import { nodeTypes, edgeTypes } from "./CanvasElements";
import type { Diagram } from "./model";
import "./preview.css";

function Canvas({ diagram }: { diagram: Diagram }) {
  const host = useRef<HTMLDivElement>(null);
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);
  useEffect(() => {
    if (!host.current || !flow) return;
    const observer = new ResizeObserver(() => {
      void flow.fitView({ padding: 0.2, maxZoom: 1 });
    });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [flow]);
  const nodes: Node[] = [
    ...diagram.entities.map((e) => ({
      id: e.id,
      type: "entity",
      position: e.position,
      data: { entity: e, readOnly: true },
    })),
    ...(diagram.strokes ?? []).map((stroke) => ({
      id: stroke.id,
      type: "stroke",
      position: stroke.position,
      data: { stroke },
    })),
  ];
  const edges = diagram.relationships.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    sourceHandle: r.source_handle ?? "right",
    targetHandle: r.target_handle ?? "left",
    type: "relation",
    data: { relation: r },
  }));
  return (
    <div ref={host} style={{ height: "100%" }}>
      <ReactFlow
        onInit={setFlow}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.01}
        maxZoom={2}
      >
        <Background />
        <Controls showInteractive={false} />
        <svg>
          <defs>
            {[false, true].map((start) => (
              <marker
                key={String(start)}
                id={`erd-crowfoot${start ? "-start" : ""}`}
                markerWidth="12"
                markerHeight="12"
                refX={start ? 1 : 11}
                refY="6"
                orient={start ? "auto-start-reverse" : "auto"}
              >
                <path
                  d="M1 1 L11 6 L1 11 M1 6 L11 6"
                  stroke="#607889"
                  fill="none"
                />
              </marker>
            ))}
            {[false, true].map((start) => (
              <marker
                key={String(start)}
                id={`erd-one${start ? "-start" : ""}`}
                markerWidth="8"
                markerHeight="12"
                refX={start ? 1 : 7}
                refY="6"
                orient={start ? "auto-start-reverse" : "auto"}
              >
                <path d="M6 1 L6 11" stroke="#607889" fill="none" />
              </marker>
            ))}
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
}

export default function DiagramPreview({ diagram }: { diagram: Diagram }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className="submission-preview" aria-label="Read-only saved diagram">
      <button
        className="preview-action"
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        Enlarge diagram
      </button>
      <div style={{ height: 330 }}>
        <Canvas diagram={diagram} />
      </div>
      <dialog
        ref={dialog}
        style={{ width: "92vw", maxWidth: "none", height: "85vh" }}
      >
        <button
          className="preview-action"
          type="button"
          onClick={() => dialog.current?.close()}
        >
          Close enlarged diagram
        </button>
        <div style={{ height: "calc(100% - 48px)" }}>
          <Canvas diagram={diagram} />
        </div>
      </dialog>
    </div>
  );
}
