import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import type {
  FrontendRenderer,
  FrontendRendererArgs,
} from "@streamlit/component-v2-lib";
import {
  Excalidraw,
  MainMenu,
  CaptureUpdateAction,
  convertToExcalidrawElements,
  exportToBlob,
  exportToSvg,
  newElementWith,
} from "@excalidraw/excalidraw";
import type {
  ExcalidrawImperativeAPI,
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  advancedFields,
  blockKinds,
  catalog,
  emptyDocument,
  kindLabel,
  markdown,
  operationalFields,
  persistentState,
  review,
  title,
  validateLocal,
  type Element,
  type Metadata,
  type PipelineDocument,
} from "./pipelineModel";
import { recovery, type Draft } from "./pipelineRecovery";
import { componentData } from "./componentData";
import PipelinePreview from "./PipelinePreview";
import PreviewBoundary from "./PreviewBoundary";
import "@excalidraw/excalidraw/index.css";
import "./pipeline.css";

type Event = Record<string, unknown> & { requestId: string; action: string };
type Response = {
  requestId: string;
  action: string;
  ok: boolean;
  error?: string;
  documentId?: string;
  revision?: number;
  clientRevision?: number;
  document?: PipelineDocument;
};
type Data = {
  preview?: PipelineDocument;
  cacheKey?: string;
  attemptLinked?: boolean;
  workspaceId?: string;
  documents: { document_id: string; name: string; revision: number }[];
  response?: Response;
  storageKey: string;
};
const asElements = (elements: readonly Element[]) =>
  elements as unknown as readonly ExcalidrawElement[];
function download(
  data: string | Blob,
  name: string,
  mime = "application/json",
) {
  const url = URL.createObjectURL(
    typeof data === "string" ? new Blob([data], { type: mime }) : data,
  );
  return { url, name };
}
const colors: Record<string, string> = {
  source: "#d3f9d8",
  ingestion: "#c5f6fa",
  storage: "#d0ebff",
  transformation: "#e5dbff",
  quality: "#fff3bf",
  orchestration: "#ffe8cc",
  destination: "#c3fae8",
};
function makeBlock(
  kind: string,
  x: number,
  y: number,
  label = kindLabel(kind),
  settings: Record<string, string> = {},
) {
  return convertToExcalidrawElements([
    {
      type: kind === "quality" ? "diamond" : "rectangle",
      x,
      y,
      width: 210,
      height: 110,
      backgroundColor: colors[kind],
      fillStyle: "solid",
      roughness: 0,
      strokeColor: "#315249",
      label: { text: label, fontSize: 18, fontFamily: 2 },
      customData: { pipeline: { version: 1, kind, settings } },
    },
  ]);
}
function template(name: string) {
  const definitions: Record<
    string,
    [string, string, Record<string, string>][]
  > = {
    api: [
      ["source", "Orders API", { access: "api" }],
      [
        "ingestion",
        "Fetch new orders",
        {
          access: "api",
          scope: "incremental",
          pagination: "cursor",
          delivery: "polling",
          trigger: "scheduled",
          schedule: "Hourly",
        },
      ],
      ["storage", "Staging", { write: "append" }],
      ["quality", "Validate orders", {}],
      [
        "destination",
        "Orders warehouse",
        { write: "merge", mergeKeys: "order_id" },
      ],
    ],
    cdc: [
      ["source", "Operational database", {}],
      [
        "ingestion",
        "Capture changes",
        { access: "cdc", mechanism: "logs", delivery: "stream" },
      ],
      ["storage", "Raw change events", { write: "append" }],
      ["transformation", "Apply changes", { table: "delta", write: "merge" }],
      ["destination", "Lakehouse", {}],
    ],
    batch: [
      ["source", "Daily files", { access: "file" }],
      ["ingestion", "Bulk load", { loading: "bulk", trigger: "scheduled" }],
      ["storage", "Staging", { write: "overwrite" }],
      ["quality", "Audit batch", { publication: "wap" }],
      ["destination", "Publish dataset", { publication: "swap" }],
    ],
  };
  const ids = definitions[name].map(() => crypto.randomUUID());
  const skeletons: NonNullable<
    Parameters<typeof convertToExcalidrawElements>[0]
  > = definitions[name].map(([kind, label, settings], i) => ({
    id: ids[i],
    type: kind === "quality" ? "diamond" : "rectangle",
    x: i * 290,
    y: 100,
    width: 210,
    height: 110,
    backgroundColor: colors[kind],
    fillStyle: "solid",
    roughness: 0,
    strokeColor: "#315249",
    label: { text: label, fontSize: 18, fontFamily: 2 },
    customData: { pipeline: { version: 1, kind, settings } },
  }));
  const arrows = ids.slice(1).map((id, i) => ({
    type: "arrow" as const,
    x: i * 290 + 210,
    y: 155,
    width: 80,
    height: 0,
    start: { id: ids[i] },
    end: { id },
    customData: { pipeline: { version: 1, kind: "data-flow", settings: {} } },
  }));
  return convertToExcalidrawElements([...skeletons, ...arrows], {
    regenerateIds: false,
  });
}

// Keep canvas props stable while toolbar, save acknowledgments, and panels update.
const DrawingCanvas = memo(function DrawingCanvas({
  document,
  onChange,
  onApi,
}: {
  document: PipelineDocument;
  onChange: (
    elements: readonly ExcalidrawElement[],
    state: AppState,
    files: BinaryFiles,
  ) => void;
  onApi: (api: ExcalidrawImperativeAPI) => void;
}) {
  return (
    <Excalidraw
      excalidrawAPI={onApi}
      initialData={{
        elements: asElements(document.elements),
        appState: {
          ...document.appState,
          currentItemFontFamily: 2,
        },
        files: document.files as unknown as BinaryFiles,
        scrollToContent: true,
      }}
      onChange={onChange}
      theme="light"
      validateEmbeddable={() => false}
      UIOptions={{
        canvasActions: {
          loadScene: false,
          saveToActiveFile: false,
          export: false,
          toggleTheme: false,
        },
      }}
    >
      <MainMenu>
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
        <MainMenu.DefaultItems.Help />
      </MainMenu>
    </Excalidraw>
  );
});

function Designer({
  data,
  emit,
  onBusy,
}: {
  data: Data;
  emit: (event: Event) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [current, setCurrent] = useState<{
    id: string;
    revision: number;
    document: PipelineDocument;
  } | null>(null);
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [panel, setPanel] = useState("blocks");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Saved");
  const [error, setError] = useState("");
  const [exportReady, setExportReady] = useState<{
    url: string;
    name: string;
  } | null>(null);
  useEffect(
    () => () => {
      if (exportReady) URL.revokeObjectURL(exportReady.url);
    },
    [exportReady],
  );
  function deliver(
    data: string | Blob,
    name: string,
    mime = "application/json",
  ) {
    setExportReady(download(data, name, mime));
  }
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [busy, setBusy] = useState(false);
  const [full, setFull] = useState(false);
  const recoveryPending = useRef(false);
  const lastValid = useRef<PipelineDocument>(emptyDocument());
  const latest = useRef<PipelineDocument>(emptyDocument());
  const identity = useRef("");
  const revision = useRef(0);
  const clientRevision = useRef(0);
  const saved = useRef("");
  const knownFiles = useRef(new Set<string>());
  const inFlight = useRef<{
    requestId: string;
    signature: string;
    files: string[];
    revision: number;
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoveryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selection = useRef<string[]>([]);
  const sceneStamp = useRef("");
  const elementStamp = useRef("");
  const seenResponse = useRef("");
  const pendingRequest = useRef("");
  const blocked = status !== "Saved" || busy || !!draft;
  useEffect(() => {
    if (data.attemptLinked) onBusy(blocked);
  }, [blocked]);
  const shell = useRef<HTMLDivElement>(null);
  const send = (action: string, payload: Record<string, unknown> = {}) => {
    if (timer.current) clearTimeout(timer.current);
    const event = {
      action,
      requestId: crypto.randomUUID(),
      ...(data.attemptLinked
        ? { documentId: data.workspaceId, baseRevision: revision.current }
        : {}),
      ...payload,
    };
    pendingRequest.current = event.requestId;
    setBusy(true);
    emit(event);
    return event.requestId;
  };
  const persistRecovery = () => {
    if (
      recoveryPending.current ||
      !identity.current ||
      JSON.stringify(latest.current) === saved.current
    )
      return;
    void recovery(`${data.storageKey}:${identity.current}`, {
      document: latest.current,
      revision: revision.current,
      updatedAt: Date.now(),
    }).catch(() =>
      setError(
        "Browser recovery storage is unavailable. Keep this window open until saved, or download your project.",
      ),
    );
  };
  useEffect(() => {
    if (data.attemptLinked && data.workspaceId)
      send("open", { documentId: data.workspaceId });
  }, []);
  const save = () => {
    if (recoveryPending.current || !identity.current || inFlight.current)
      return;
    const doc = latest.current,
      signature = JSON.stringify(doc);
    if (signature === saved.current) {
      setStatus("Saved");
      return;
    }
    try {
      validateLocal(doc);
    } catch (e) {
      setError(String((e as Error).message));
      setStatus("Save failed");
      return;
    }
    const newFiles = Object.fromEntries(
      Object.entries(doc.files).filter(([id]) => !knownFiles.current.has(id)),
    );
    const requestId = crypto.randomUUID();
    inFlight.current = {
      requestId,
      signature,
      files: Object.keys(newFiles),
      revision: ++clientRevision.current,
    };
    setStatus("Saving…");
    emit({
      action: "save",
      requestId,
      documentId: identity.current,
      clientRevision: clientRevision.current,
      baseRevision: revision.current,
      document: { ...doc, files: {} },
      newFiles,
    });
  };
  const schedule = () => {
    setStatus("Unsaved changes");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 500);
    if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
    recoveryTimer.current = setTimeout(persistRecovery, 150);
  };
  useEffect(() => {
    const leave = (event: BeforeUnloadEvent) => {
      if (
        identity.current &&
        JSON.stringify(latest.current) !== saved.current
      ) {
        persistRecovery();
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => {
      window.removeEventListener("beforeunload", leave);
      if (timer.current) clearTimeout(timer.current);
      if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
      if (panelTimer.current) clearTimeout(panelTimer.current);
      persistRecovery();
    };
  }, []);
  useEffect(() => {
    const response = data.response;
    if (!response || seenResponse.current === response.requestId) return;
    seenResponse.current = response.requestId;
    if (response.action === "save") {
      const pending = inFlight.current;
      if (
        !pending ||
        pending.requestId !== response.requestId ||
        response.documentId !== identity.current ||
        response.clientRevision !== pending.revision
      )
        return;
      inFlight.current = null;
      if (!response.ok) {
        setStatus("Save failed");
        setError(response.error || "Save failed.");
        persistRecovery();
        return;
      }
      revision.current = response.revision!;
      saved.current = pending.signature;
      pending.files.forEach((id) => knownFiles.current.add(id));
      setError("");
      if (JSON.stringify(latest.current) === saved.current) {
        setStatus("Saved");
        void recovery(`${data.storageKey}:${identity.current}`, null);
      } else {
        persistRecovery();
        save();
      }
      return;
    }
    if (pendingRequest.current !== response.requestId) return;
    setBusy(false);
    if (!response.ok) {
      setError(response.error || "Request failed.");
      return;
    }
    setError("");
    setConfirmDelete(false);
    setDraft(null);
    setExportReady(null);
    if (response.action === "delete") {
      void recovery(`${data.storageKey}:${identity.current}`, null);
      identity.current = "";
      setCurrent(null);
      setApi(null);
      return;
    }
    if (response.document && response.documentId) {
      if (timer.current) clearTimeout(timer.current);
      identity.current = response.documentId;
      revision.current = response.revision!;
      recoveryPending.current = true;
      sceneStamp.current = "";
      elementStamp.current = "";
      if (panelTimer.current) clearTimeout(panelTimer.current);
      selection.current = [];
      lastValid.current = response.document;
      latest.current = response.document;
      saved.current = JSON.stringify(response.document);
      knownFiles.current = new Set(Object.keys(response.document.files));
      setCurrent({
        id: response.documentId,
        revision: response.revision!,
        document: response.document,
      });
      setApi(null);
      setSelected([]);
      setStatus("Saved");
      setNewName("");
      setPanel("blocks");
      const id = response.documentId;
      void recovery(`${data.storageKey}:${id}`)
        .then((found) => {
          if (identity.current !== id) return;
          const hasDraft =
            found && JSON.stringify(found.document) !== saved.current;
          recoveryPending.current = !!hasDraft;
          if (hasDraft) {
            setDraft(found);
            setStatus("Recovery available");
          } else save();
        })
        .catch(() => {
          recoveryPending.current = false;
          setError("Browser recovery storage is unavailable.");
          save();
        });
    }
  }, [data.response]);

  useEffect(() => {
    if (api)
      api.scrollToContent(undefined, {
        fitToViewport: true,
        viewportZoomFactor: 0.8,
      });
  }, [api]);
  useEffect(() => {
    const handler = () => setFull(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.current?.requestFullscreen();
    } catch {
      setError(
        "Expanded view is unavailable in this browser. Collapse the app sidebar for more canvas space.",
      );
    }
  }
  function changed(
    elements: readonly ExcalidrawElement[],
    state: AppState,
    files: BinaryFiles,
  ) {
    const ids = Object.keys(state.selectedElementIds).filter(
      (id) => state.selectedElementIds[id],
    );
    if (
      selection.current.length !== ids.length ||
      selection.current.some((id, i) => id !== ids[i])
    ) {
      selection.current = ids;
      setSelected(ids);
    }
    const referenced = new Set<string | null>(
      elements
        .filter((e) => e.type === "image")
        .map((e) => (e.type === "image" ? e.fileId : null)),
    );
    const filteredFiles = Object.fromEntries(
      Object.entries(files).filter(
        ([id]) => referenced.has(id) || knownFiles.current.has(id),
      ),
    ) as BinaryFiles;
    const persistent = persistentState(
      state as unknown as Record<string, unknown>,
    );
    const contentStamp = JSON.stringify(
      elements.map((e) => [e.id, e.version, e.versionNonce]),
    );
    if (
      data.attemptLinked &&
      (!elementStamp.current || contentStamp === elementStamp.current)
    ) {
      // Excalidraw hydration and fit/pan/zoom are view operations. Keep the
      // exact saved document until an actual canvas edit arrives.
      elementStamp.current = contentStamp;
      return;
    }
    elementStamp.current = contentStamp;
    const stamp = JSON.stringify([
      elements.map((e) => [e.id, e.version, e.versionNonce]),
      persistent,
      Object.keys(filteredFiles),
    ]);
    if (stamp === sceneStamp.current) return;
    sceneStamp.current = stamp;
    const candidate = {
      ...latest.current,
      elements: elements as unknown as Element[],
      appState: persistent,
      files: filteredFiles as unknown as PipelineDocument["files"],
    };
    const changedAssets = Object.keys(candidate.files).some(
      (id) => !lastValid.current.files[id],
    );
    if (changedAssets || candidate.elements.length > 2000) {
      try {
        validateLocal(candidate);
      } catch (error) {
        setError(
          `${(error as Error).message} The addition was rejected; your previous drawing is intact.`,
        );
        const previous = lastValid.current;
        queueMicrotask(() =>
          api?.updateScene({
            elements: asElements(previous.elements),
            captureUpdate: CaptureUpdateAction.NEVER,
          }),
        );
        return;
      }
    }
    latest.current = candidate;
    lastValid.current = candidate;
    // Drawing stays synchronous inside Excalidraw. Refresh surrounding panels
    // after a gesture pauses rather than reconciling the whole shell per frame.
    if (panelTimer.current) clearTimeout(panelTimer.current);
    if (
      state.cursorButton === "down" ||
      state.editingTextElement ||
      state.isResizing ||
      state.isRotating
    )
      panelTimer.current = setTimeout(() => setTick((t) => t + 1), 120);
    else setTick((t) => t + 1);
    schedule();
  }
  const changeHandler = useRef(changed);
  changeHandler.current = changed;
  const canvasChanged = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      state: AppState,
      files: BinaryFiles,
    ) => changeHandler.current(elements, state, files),
    [],
  );

  const selectedElement =
    latest.current.elements.find(
      (e) => selected.includes(e.id) && !e.isDeleted && e.type !== "text",
    ) ??
    latest.current.elements.find(
      (e) => selected.includes(e.id) && !e.isDeleted,
    );
  const meta = selectedElement?.customData?.pipeline;
  function updateMeta(next: Metadata | undefined) {
    if (!api || !selectedElement) return;
    const elements = api.getSceneElementsIncludingDeleted().map((el) => {
      if (el.id !== selectedElement.id) return el;
      const customData: Record<string, unknown> = { ...el.customData };
      if (next) customData.pipeline = next;
      else delete customData.pipeline;
      return newElementWith(el, { customData });
    });
    api.updateScene({
      elements,
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  }
  function setting(key: string, value: string) {
    if (meta)
      updateMeta({ ...meta, settings: { ...meta.settings, [key]: value } });
  }
  function addBlock(kind: string) {
    if (!api) return;
    const state = api.getAppState();
    const elements = makeBlock(
      kind,
      -state.scrollX + 100 / state.zoom.value,
      -state.scrollY + 160 / state.zoom.value,
    );
    api.updateScene({
      elements: [...api.getSceneElementsIncludingDeleted(), ...elements],
      appState: { selectedElementIds: { [elements[0].id]: true } },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
    setPanel("details");
  }
  async function exportFile(kind: string) {
    try {
      const doc = latest.current;
      const name = doc.name.replace(/[^\w.-]+/g, "_") || "pipeline";
      if (kind === "json")
        deliver(JSON.stringify(doc, null, 2), `${name}.pipeline.json`);
      if (kind === "excalidraw")
        deliver(
          JSON.stringify(
            {
              type: "excalidraw",
              version: 2,
              source: "Pipeline Designer",
              elements: doc.elements,
              appState: doc.appState,
              files: doc.files,
            },
            null,
            2,
          ),
          `${name}.excalidraw`,
        );
      if (kind === "md") deliver(markdown(doc), `${name}.md`, "text/markdown");
      if (kind === "png" || kind === "svg") {
        const opts = {
          elements: asElements(doc.elements.filter((e) => !e.isDeleted)),
          appState: { ...doc.appState, exportBackground: true },
          files: doc.files as unknown as BinaryFiles,
        };
        if (kind === "png")
          deliver(
            await exportToBlob({
              ...opts,
              mimeType: "image/png",
              maxWidthOrHeight: 8192,
            }),
            `${name}.png`,
          );
        else
          deliver(
            (await exportToSvg(opts)).outerHTML,
            `${name}.svg`,
            "image/svg+xml",
          );
      }
    } catch (e) {
      setError(`Export failed: ${(e as Error).message}`);
    }
  }
  async function importFile(file: File) {
    try {
      if (file.size > 25 * 1024 * 1024)
        throw new Error("Project exceeds the 25 MiB limit.");
      const value = JSON.parse(await file.text());
      if (value.type === "excalidraw" && value.version !== 2)
        throw new Error("Unsupported Excalidraw document version.");
      const doc =
        value.type === "excalidraw"
          ? {
              ...emptyDocument(file.name.replace(/\.[^.]+$/, "")),
              elements: value.elements,
              files: value.files || {},
              appState: value.appState || {},
            }
          : value;
      validateLocal(doc);
      send("import", { document: doc, name: doc.name });
    } catch (e) {
      setError(`Import failed: ${(e as Error).message}`);
    }
  }
  function create() {
    const doc = emptyDocument(newName.trim() || "Untitled pipeline");
    if (newTemplate)
      doc.elements = template(newTemplate) as unknown as Element[];
    send("create", { name: doc.name, document: doc });
  }
  const docDirty = status !== "Saved";
  const locked = blocked || !!docDirty;
  const findings = useMemo(
    () => review(latest.current.elements),
    [latest.current.elements],
  );
  void tick;
  return (
    <div
      ref={shell}
      className={`pipeline-designer ${full ? "pipeline-full" : ""}`}
    >
      <header className="pipeline-toolbar">
        <div className="pipeline-project">
          <strong>Pipeline Designer</strong>
          <span>From sketch to build specification</span>
        </div>
        {!data.attemptLinked && (
          <label>
            Project
            <select
              aria-label="Saved pipeline projects"
              disabled={!!locked}
              value={current?.id || ""}
              onChange={(e) => {
                if (e.target.value)
                  send("open", { documentId: e.target.value });
              }}
            >
              <option value="">Choose a project</option>
              {data.documents.map((d) => (
                <option key={d.document_id} value={d.document_id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          disabled={!!locked}
          onClick={() => setPanel(panel === "projects" ? "blocks" : "projects")}
        >
          {data.attemptLinked ? "Templates" : "New / manage"}
        </button>
        {current && (
          <>
            {data.attemptLinked && (
              <button
                disabled={busy || !!inFlight.current || !!draft}
                onClick={() => send("return", { document: latest.current })}
              >
                Save and return to attempt
              </button>
            )}
            <button
              onClick={() => setPanel(panel === "review" ? "blocks" : "review")}
            >
              Review design{findings.length ? ` (${findings.length})` : ""}
            </button>
            <button
              onClick={() => setPanel(panel === "export" ? "blocks" : "export")}
            >
              Export
            </button>
            <button
              onClick={() =>
                api?.scrollToContent(undefined, {
                  fitToViewport: true,
                  viewportZoomFactor: 0.8,
                })
              }
            >
              Fit view
            </button>
            <button onClick={() => void toggleFull()}>
              {full ? "Exit expanded view" : "Expand canvas"}
            </button>
            <span role="status" className="pipeline-status">
              {docDirty && status === "Saved" ? "Unsaved changes" : status}
            </span>
          </>
        )}
      </header>
      {exportReady && (
        <div className="pipeline-download" role="status">
          Export ready:{" "}
          <a href={exportReady.url} download={exportReady.name}>
            Download {exportReady.name}
          </a>
          <button onClick={() => setExportReady(null)}>Dismiss</button>
        </div>
      )}
      {error && (
        <div className="pipeline-alert" role="alert">
          {error}{" "}
          {current && (
            <>
              <button
                onClick={() => {
                  setError("");
                  save();
                }}
              >
                Retry save
              </button>
              <button onClick={() => exportFile("json")}>Download draft</button>
              <button
                disabled={busy || !!inFlight.current || data.attemptLinked}
                onClick={() =>
                  send("create", {
                    name: latest.current.name + " (recovered)",
                    document: latest.current,
                  })
                }
              >
                Save as new project
              </button>
            </>
          )}
        </div>
      )}
      {draft && (
        <div className="pipeline-alert">
          A recovery draft is available
          {draft.revision !== revision.current
            ? "; the saved project has also changed"
            : ""}
          .
          <button
            onClick={() => {
              send("create", {
                name: `${draft.document.name.slice(0, 185)} (recovered)`,
                document: draft.document,
              });
            }}
          >
            {data.attemptLinked
              ? "Restore draft to this attempt"
              : "Recover as new project"}
          </button>
          <button
            onClick={() =>
              deliver(
                JSON.stringify(draft.document, null, 2),
                "recovery.pipeline.json",
              )
            }
          >
            Download recovery
          </button>
          <button
            onClick={() => {
              void recovery(`${data.storageKey}:${identity.current}`, null);
              setDraft(null);
              recoveryPending.current = false;
              save();
            }}
          >
            Keep saved version
          </button>
        </div>
      )}
      <div className="pipeline-body">
        <nav className="pipeline-tabs" aria-label="Pipeline panels">
          {current &&
            ["blocks", "details", "notes"].map((p) => (
              <button
                key={p}
                aria-pressed={panel === p}
                onClick={() => setPanel(panel === p ? "" : p)}
              >
                {kindLabel(p)}
              </button>
            ))}
        </nav>
        {(panel || !current) && (
          <aside className="pipeline-panel">
            {(!current || panel === "projects") && (
              <>
                <h2>{current ? "Manage projects" : "Plan a pipeline"}</h2>
                <p>
                  Start with a blank canvas or a working outline. Every decision
                  stays editable.
                </p>
                <label>
                  New project name
                  <input
                    value={newName}
                    maxLength={200}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Orders ingestion"
                  />
                </label>
                <label>
                  Template
                  <select
                    value={newTemplate}
                    onChange={(e) => setNewTemplate(e.target.value)}
                  >
                    <option value="">Blank canvas</option>
                    <option value="api">Paginated API to warehouse</option>
                    <option value="cdc">Database CDC to lakehouse</option>
                    <option value="batch">
                      File batch, audit, and publish
                    </option>
                  </select>
                </label>
                <button
                  className="pipeline-primary"
                  disabled={
                    !!locked ||
                    (data.attemptLinked &&
                      latest.current.elements.some((e) => !e.isDeleted) &&
                      !confirmDelete)
                  }
                  onClick={create}
                >
                  {data.attemptLinked
                    ? "Replace with selected template"
                    : "Create project"}
                </button>
                {data.attemptLinked && (
                  <label>
                    <input
                      type="checkbox"
                      checked={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.checked)}
                    />
                    Confirm replacement of this deliverable
                  </label>
                )}
                <label className="pipeline-import">
                  Import project or Excalidraw
                  <input
                    type="file"
                    accept=".json,.excalidraw"
                    disabled={!!locked}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void importFile(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {current && !data.attemptLinked && (
                  <>
                    <hr />
                    <label>
                      Project name
                      <input
                        maxLength={200}
                        value={latest.current.name}
                        onChange={(e) => {
                          latest.current = {
                            ...latest.current,
                            name: e.target.value,
                          };
                          setTick((t) => t + 1);
                          schedule();
                        }}
                      />
                    </label>
                    <button
                      disabled={!!locked}
                      onClick={() =>
                        send("duplicate", {
                          name: latest.current.name.slice(0, 193) + " (copy)",
                          document: latest.current,
                        })
                      }
                    >
                      Duplicate project
                    </button>
                    <label className="pipeline-check">
                      <input
                        type="checkbox"
                        checked={confirmDelete}
                        onChange={(e) => setConfirmDelete(e.target.checked)}
                      />
                      Confirm permanent deletion
                    </label>
                    <button
                      disabled={!confirmDelete || !!locked}
                      onClick={() =>
                        send("delete", {
                          documentId: identity.current,
                          baseRevision: revision.current,
                        })
                      }
                    >
                      Delete project
                    </button>
                  </>
                )}
              </>
            )}
            {current && panel === "blocks" && (
              <>
                <h2>Pipeline blocks</h2>
                <p>
                  Add a component, connect it with an arrow, then describe its
                  decisions.
                </p>
                <div className="pipeline-blocks">
                  {blockKinds.map((kind) => (
                    <button key={kind} onClick={() => addBlock(kind)}>
                      <span style={{ background: colors[kind] }} />
                      {kindLabel(kind)}
                    </button>
                  ))}
                </div>
                <p className="pipeline-hint">
                  Select any shape to add pipeline details. Select an arrow to
                  mark data or control flow.
                </p>
              </>
            )}
            {current && panel === "details" && (
              <>
                <h2>Details</h2>
                {!selectedElement ? (
                  <p>
                    Select a shape or arrow on the canvas. Double-click its
                    label to rename it.
                  </p>
                ) : (
                  <>
                    <p>{title(selectedElement, latest.current.elements)}</p>
                    <label>
                      Pipeline role
                      <select
                        value={meta?.kind || ""}
                        onChange={(e) =>
                          updateMeta(
                            e.target.value
                              ? {
                                  version: 1,
                                  kind: e.target.value,
                                  settings: meta?.settings || {},
                                }
                              : undefined,
                          )
                        }
                      >
                        <option value="">
                          Drawing only — add pipeline details
                        </option>
                        {(selectedElement.type === "arrow"
                          ? ["data-flow", "control-flow"]
                          : blockKinds
                        ).map((kind) => (
                          <option key={kind} value={kind}>
                            {kindLabel(kind)}
                          </option>
                        ))}
                      </select>
                    </label>
                    {meta && (
                      <>
                        <label>
                          Find a method
                          <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cursor, MERGE, SCD…"
                          />
                        </label>
                        {catalog
                          .filter(
                            (c) =>
                              (query ||
                                !c.kinds.length ||
                                c.kinds.includes(meta.kind)) &&
                              !meta.kind.endsWith("flow"),
                          )
                          .map((c) => {
                            const matches = c.options.filter((o) =>
                              `${c.label} ${o.join(" ")}`
                                .toLowerCase()
                                .includes(query.toLowerCase()),
                            );
                            if (query && !matches.length) return null;
                            const value = meta.settings[c.id] || "";
                            const custom =
                              value.startsWith("custom:") ||
                              (!!value &&
                                !c.options.some((o) => o[0] === value));
                            return (
                              <div key={c.id} className="pipeline-field">
                                <label title={c.help}>
                                  {c.label}
                                  <select
                                    value={custom ? "custom" : value}
                                    onChange={(e) =>
                                      setting(
                                        c.id,
                                        e.target.value === "custom"
                                          ? "custom:"
                                          : e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Unspecified</option>
                                    {c.options.map((o) => (
                                      <option key={o[0]} value={o[0]}>
                                        {o[1]}
                                      </option>
                                    ))}
                                    <option value="custom">Custom</option>
                                  </select>
                                </label>
                                {custom && (
                                  <input
                                    aria-label={`Custom ${c.label}`}
                                    value={value.replace(/^custom:/, "")}
                                    onChange={(e) =>
                                      setting(c.id, `custom:${e.target.value}`)
                                    }
                                  />
                                )}
                              </div>
                            );
                          })}
                        {advancedFields(meta.settings).map(([key, label]) => (
                          <label key={key}>
                            {label}
                            <input
                              value={meta.settings[key] || ""}
                              onChange={(e) => setting(key, e.target.value)}
                              placeholder="Unspecified"
                            />
                          </label>
                        ))}
                        <details open={!!query}>
                          <summary>Operational details</summary>
                          {operationalFields.map(([key, label]) => (
                            <label key={key}>
                              {label}
                              <textarea
                                rows={2}
                                value={meta.settings[key] || ""}
                                onChange={(e) => setting(key, e.target.value)}
                                placeholder="Unspecified"
                              />
                            </label>
                          ))}
                        </details>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {current && panel === "notes" && (
              <>
                <h2>Planning notes</h2>
                <p>
                  Capture goals, assumptions, and questions for the whole
                  pipeline.
                </p>
                <textarea
                  aria-label="Planning notes"
                  rows={16}
                  value={latest.current.notes}
                  onChange={(e) => {
                    latest.current = {
                      ...latest.current,
                      notes: e.target.value,
                    };
                    setTick((t) => t + 1);
                    schedule();
                  }}
                />
              </>
            )}
            {current && panel === "review" && (
              <>
                <h2>Review design</h2>
                <p>
                  Advisory checks help identify missing decisions. They do not
                  validate runtime correctness.
                </p>
                {findings.length ? (
                  findings.map((f, i) => (
                    <button
                      className="pipeline-finding"
                      key={`${f.id}:${i}`}
                      onClick={() => {
                        const el = api
                          ?.getSceneElements()
                          .find((e) => e.id === f.id);
                        if (el) {
                          api?.updateScene({
                            appState: { selectedElementIds: { [f.id]: true } },
                          });
                          api?.scrollToContent(el, { animate: true });
                          setPanel("details");
                        }
                      }}
                    >
                      {f.message}
                    </button>
                  ))
                ) : (
                  <p>No findings from the basic checks.</p>
                )}
              </>
            )}
            {current && panel === "export" && (
              <>
                <h2>Export</h2>
                <p>
                  Project JSON includes the drawing, images, pipeline settings,
                  and notes.
                </p>
                {[
                  ["json", "Complete project JSON"],
                  ["excalidraw", "Excalidraw drawing"],
                  ["md", "Build specification (.md)"],
                  ["png", "Drawing PNG"],
                  ["svg", "Drawing SVG"],
                ].map(([kind, label]) => (
                  <button
                    className="pipeline-export"
                    key={kind}
                    onClick={() => void exportFile(kind)}
                  >
                    {label}
                  </button>
                ))}
                <p>
                  Excalidraw files preserve element details; project-level
                  planning notes are included in project JSON and Markdown.
                </p>
              </>
            )}
          </aside>
        )}
        <div className="pipeline-canvas">
          {current ? (
            <DrawingCanvas
              key={current.id}
              onApi={setApi}
              document={current.document}
              onChange={canvasChanged}
            />
          ) : (
            <div className="pipeline-empty">
              <h2>A canvas for your data architecture</h2>
              <p>Sketch freely. Add engineering decisions where they matter.</p>
              <div>
                Source → Ingestion → Storage → Transformation → Destination
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const roots = new WeakMap<FrontendRendererArgs["parentElement"], Root>();
const render: FrontendRenderer<
  { event: Event | null; busy: boolean },
  Data | [Data]
> = ({ data: payload, parentElement, setStateValue }) => {
  const data = componentData(payload);
  const mount = parentElement.querySelector(".pipeline-root");
  if (!mount) throw new Error("Pipeline mount missing");
  let root = roots.get(parentElement);
  if (!root) {
    root = createRoot(mount);
    roots.set(parentElement, root);
  }
  root.render(
    data.preview ? (
      <PreviewBoundary key={data.cacheKey}>
        <PipelinePreview document={data.preview} cacheKey={data.cacheKey!} />
      </PreviewBoundary>
    ) : (
      <Designer
        data={data}
        emit={(event) => setStateValue("event", event)}
        onBusy={(busy) => setStateValue("busy", busy)}
      />
    ),
  );
  return () => {
    roots.get(parentElement)?.unmount();
    roots.delete(parentElement);
  };
};
export default render;
