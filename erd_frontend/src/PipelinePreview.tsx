import { useEffect, useRef, useState } from "react";
import { exportToSvg, restoreElements } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import type { PipelineDocument } from "./pipelineModel";
import { PreviewCache } from "./previewCache";
import "./preview.css";

const cache = new PreviewCache();
export default function PipelinePreview({
  document,
  cacheKey,
}: {
  document: PipelineDocument;
  cacheKey: string;
}) {
  const [svg, setSvg] = useState(cache.get(cacheKey));
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let live = true;
    if (cache.get(cacheKey) === undefined) {
      void Promise.resolve()
        .then(() =>
          exportToSvg({
            elements: restoreElements(
              document.elements as unknown as ExcalidrawElement[],
              null,
            ),
            files: document.files as BinaryFiles,
            appState: {
              exportBackground: true,
              viewBackgroundColor: "#ffffff",
              exportWithDarkMode: false,
            },
            exportPadding: 24,
          }),
        )
        .then((value: SVGSVGElement) => {
          const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(value.outerHTML)}`;
          cache.set(cacheKey, source);
          if (live) setSvg(source);
        })
        .catch(() => {
          if (live) setFailed(true);
        });
    }
    return () => {
      live = false;
    };
  }, [cacheKey, document]);
  if (failed)
    return (
      <p role="status">
        Visual preview unavailable. Use the saved summary or open the
        deliverable below.
      </p>
    );
  if (!svg) return <p role="status">Rendering saved pipeline…</p>;
  return (
    <div className="submission-preview" aria-label="Read-only saved pipeline">
      <button
        className="preview-action"
        type="button"
        onClick={() => dialog.current?.showModal()}
      >
        Enlarge pipeline
      </button>
      <img
        src={svg}
        alt="Saved pipeline design"
        style={{ width: "100%", height: 330, objectFit: "contain" }}
      />
      <dialog
        ref={dialog}
        style={{ width: "92vw", maxWidth: "none", height: "85vh" }}
      >
        <button
          className="preview-action"
          type="button"
          onClick={() => dialog.current?.close()}
        >
          Close enlarged pipeline
        </button>
        <div style={{ overflow: "auto", height: "calc(100% - 48px)" }}>
          <img
            src={svg}
            alt="Enlarged saved pipeline"
            style={{ minWidth: "100%", minHeight: "90%" }}
          />
        </div>
      </dialog>
    </div>
  );
}
