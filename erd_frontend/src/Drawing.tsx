import { useRef, useState, type PointerEvent } from "react";
import { useReactFlow, ViewportPortal } from "@xyflow/react";
import type { Stroke } from "./model";

export function StrokeNode({ data }: { data: { stroke: Stroke } }) {
  const stroke = data.stroke;
  const width = Math.max(...stroke.points.map((p) => p.x)) + stroke.width;
  const height = Math.max(...stroke.points.map((p) => p.y)) + stroke.width;
  return (
    <svg
      width={width}
      height={height}
      className="erd-stroke"
      aria-label="Freehand drawing"
    >
      <polyline
        points={stroke.points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DrawingLayer({
  color,
  width,
  onStroke,
}: {
  color: string;
  width: number;
  onStroke: (stroke: Stroke) => void;
}) {
  const flow = useReactFlow();
  const active = useRef<{ pointer: number; points: Stroke["points"] } | null>(
    null,
  );
  const [points, setPoints] = useState<Stroke["points"]>([]);
  const point = (event: PointerEvent) =>
    flow.screenToFlowPosition(
      { x: event.clientX, y: event.clientY },
      { snapToGrid: false },
    );
  const cancel = () => {
    active.current = null;
    setPoints([]);
  };
  const append = (event: PointerEvent) => {
    const draft = active.current;
    if (
      !draft ||
      draft.pointer !== event.pointerId ||
      draft.points.length >= 2000
    )
      return;
    const next = point(event);
    const last = draft.points[draft.points.length - 1];
    if (Math.hypot(next.x - last.x, next.y - last.y) < 1 / flow.getZoom())
      return;
    draft.points.push(next);
    setPoints([...draft.points]);
  };
  return (
    <>
      <ViewportPortal>
        <svg className="erd-drawing-preview">
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ViewportPortal>
      <div
        className="erd-drawing-surface"
        aria-label="Drawing canvas"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Escape") cancel();
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || active.current) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          active.current = { pointer: event.pointerId, points: [point(event)] };
          setPoints([...active.current.points]);
        }}
        onPointerMove={append}
        onPointerUp={(event) => {
          if (active.current?.pointer !== event.pointerId) return;
          append(event);
          const draft = active.current.points;
          const position = {
            x: Math.min(...draft.map((p) => p.x)) - width,
            y: Math.min(...draft.map((p) => p.y)) - width,
          };
          const local = draft.map((p) => ({
            x: p.x - position.x,
            y: p.y - position.y,
          }));
          if (local.length === 1)
            local.push({ x: local[0].x + 0.01, y: local[0].y });
          onStroke({
            id: crypto.randomUUID(),
            position,
            points: local,
            color,
            width,
          });
          cancel();
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
      />
    </>
  );
}
