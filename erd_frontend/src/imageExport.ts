import { toPng } from "html-to-image";
import { getNodesBounds, type ReactFlowInstance } from "@xyflow/react";

export function exportSize(bounds: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const padding = 160;
  const naturalWidth = Math.max(400, bounds.width + padding * 2);
  const naturalHeight = Math.max(300, bounds.height + padding * 2);
  const scale = Math.min(
    1.5,
    4096 / naturalWidth,
    4096 / naturalHeight,
    Math.sqrt(12_000_000 / (naturalWidth * naturalHeight)),
  );
  return {
    width: Math.ceil(naturalWidth * scale),
    height: Math.ceil(naturalHeight * scale),
    scale,
    x: (padding - bounds.x) * scale,
    y: (padding - bounds.y) * scale,
  };
}

export async function downloadDiagram(
  root: HTMLElement,
  flow: ReactFlowInstance,
  name: string,
) {
  await document.fonts.ready;
  const original = root.querySelector<HTMLElement>(".react-flow");
  if (!original) throw new Error("Canvas is unavailable");
  const bounds = getNodesBounds(flow.getNodes());
  let minX = bounds.x,
    minY = bounds.y,
    maxX = bounds.x + bounds.width,
    maxY = bounds.y + bounds.height;
  for (const edge of flow.getEdges()) {
    const lane = edge.data?.lane;
    if (typeof lane !== "number" || !Number.isFinite(lane)) continue;
    if (edge.data?.vertical) {
      minX = Math.min(minX, lane);
      maxX = Math.max(maxX, lane);
    } else {
      minY = Math.min(minY, lane);
      maxY = Math.max(maxY, lane);
    }
  }
  const size = exportSize({
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  });
  // Clone the complete flow to retain SVG marker definitions and HTML edge labels.
  // Exporting never changes the live viewport, selection, or saved document.
  const clone = original.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: "relative",
    left: "0",
    top: "0",
    width: `${size.width}px`,
    height: `${size.height}px`,
    background: "white",
  });
  clone
    .querySelectorAll(
      ".react-flow__controls, .react-flow__minimap, .react-flow__background, .react-flow__attribution, .react-flow__handle, .erd-drawing-surface, .erd-drawing-preview",
    )
    .forEach((el) => el.remove());
  clone
    .querySelectorAll(".selected, .sut-node-active")
    .forEach((el) => el.classList.remove("selected", "sut-node-active"));
  clone
    .querySelectorAll<HTMLElement>(".react-flow__node, .react-flow__edge")
    .forEach((el) => {
      el.style.opacity = "1";
    });
  clone.querySelectorAll<SVGElement>(".react-flow__edge-path").forEach((el) => {
    el.style.opacity = "1";
    el.style.stroke = "#8597a5";
    el.style.strokeWidth = "1.6";
  });
  const viewport = clone.querySelector<HTMLElement>(".react-flow__viewport");
  if (!viewport) throw new Error("Canvas viewport is unavailable");
  viewport.style.transform = `translate(${size.x}px, ${size.y}px) scale(${size.scale})`;
  const staging = document.createElement("div");
  Object.assign(staging.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
  });
  staging.appendChild(clone);
  root.appendChild(staging);
  try {
    const url = await toPng(clone, {
      width: size.width,
      height: size.height,
      pixelRatio: 1,
      backgroundColor: "#ffffff",
      style: { left: "0", top: "0" },
    });
    const link = document.createElement("a");
    link.download = `${name.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 100) || "diagram"}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { url, filename: link.download };
  } finally {
    staging.remove();
  }
}
