import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

/** Long dependencies travel outside the node lanes instead of through nodes. */
export default function QueryEdge(props: EdgeProps) {
  const lane = props.data?.lane as number | undefined;
  const vertical = Boolean(props.data?.vertical);
  let [path, labelX, labelY] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
    borderRadius: 12,
    offset: 24,
  });
  if (lane !== undefined) {
    const points = vertical
      ? [
          [props.sourceX, props.sourceY],
          [props.sourceX, props.sourceY + 24],
          [lane, props.sourceY + 24],
          [lane, props.targetY - 24],
          [props.targetX, props.targetY - 24],
          [props.targetX, props.targetY],
        ]
      : [
          [props.sourceX, props.sourceY],
          [props.sourceX + 24, props.sourceY],
          [props.sourceX + 24, lane],
          [props.targetX - 24, lane],
          [props.targetX - 24, props.targetY],
          [props.targetX, props.targetY],
        ];
    path = `M ${points[0].join(" ")}`;
    for (let i = 1; i < points.length - 1; i++) {
      const previous = points[i - 1],
        point = points[i],
        next = points[i + 1];
      const incoming = Math.hypot(
        point[0] - previous[0],
        point[1] - previous[1],
      );
      const outgoing = Math.hypot(next[0] - point[0], next[1] - point[1]);
      const radius = Math.min(12, incoming / 2, outgoing / 2);
      if (!incoming || !outgoing) {
        path += ` L ${point.join(" ")}`;
        continue;
      }
      const start = point.map(
        (value, axis) => value - ((value - previous[axis]) / incoming) * radius,
      );
      const end = point.map(
        (value, axis) => value + ((next[axis] - value) / outgoing) * radius,
      );
      path += ` L ${start.join(" ")} Q ${point.join(" ")} ${end.join(" ")}`;
    }
    path += ` L ${points.at(-1)!.join(" ")}`;
    labelX = vertical ? lane : (props.sourceX + props.targetX) / 2;
    labelY = vertical ? (props.sourceY + props.targetY) / 2 : lane;
  }
  return (
    <BaseEdge
      id={props.id}
      path={path}
      markerEnd={props.markerEnd}
      style={props.style}
      label={props.label}
      labelX={labelX}
      labelY={labelY}
      labelStyle={props.labelStyle}
      labelShowBg={props.labelShowBg}
      labelBgStyle={props.labelBgStyle}
      labelBgPadding={props.labelBgPadding}
      labelBgBorderRadius={props.labelBgBorderRadius}
    />
  );
}
