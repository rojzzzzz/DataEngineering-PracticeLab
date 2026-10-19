import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ReactFlow,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "@xyflow/react";

import {
  removeElements,
  arrangeEntities,
  nextName,
  moveField,
  type Diagram,
  type Entity,
  type Field,
  type Relationship,
} from "./model";
import { nodeTypes, edgeTypes } from "./CanvasElements";
import { downloadDiagram } from "./imageExport";
import { DiagramSession } from "./diagramSession";
import { DrawingLayer } from "./Drawing";
import type { SqlImport } from "./sqlDiagram";

type Props = {
  attemptLinked?: boolean;
  onReturn?: (diagram: Diagram) => void;
  onBusy?: (busy: boolean) => void;
  diagram: Diagram;
  documentId: string;
  layout?: "embedded" | "workspace";
  documentName?: string;
  savedDiagram?: Diagram;
  saveError?: string | null;
  kind: string;
  onSave: (diagram: Diagram) => void;
  sqlImport?: SqlImport | null;
  onSqlImportResult?: (value: {
    id: string;
    error?: string;
    message?: string;
  }) => void;
};

const uid = () => crypto.randomUUID();
function StudioIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 9h18M9 9v12M3 15h18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
const defaultRole = (kind: string): Entity["role"] =>
  kind === "conceptual_erd"
    ? "entity"
    : kind === "star_schema"
      ? "dimension"
      : "table";
const defaultRelation = (source: string, target: string): Relationship => ({
  id: uid(),
  source,
  target,
  label: "",
  source_cardinality: "one",
  target_cardinality: "many",
  source_optional: false,
  target_optional: true,
});

export default function Editor({
  attemptLinked,
  onReturn,
  onBusy,
  diagram: initial,
  documentId,
  layout = "embedded",
  documentName = "diagram",
  savedDiagram,
  saveError,
  kind,
  onSave,
  sqlImport,
  onSqlImportResult,
}: Props) {
  const editorRoot = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#126e63");
  const [drawWidth, setDrawWidth] = useState(3);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [exportImage, setExportImage] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  // index.tsx keys Editor by documentId: one session per mounted document.
  const [session] = useState(
    () =>
      new DiagramSession({
        documentId,
        diagram: initial,
        savedDiagram,
        workspace: layout === "workspace",
        save: (value) => saveRef.current(value),
      }),
  );
  const { diagram, conflictingDraft, canUndo, canRedo, isSaved } =
    useSyncExternalStore(session.subscribe, session.getSnapshot);
  useEffect(() => {
    if (attemptLinked) onBusy?.(!isSaved || !!conflictingDraft || !!saveError);
  }, [isSaved, conflictingDraft, saveError]);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);
  const [search, setSearch] = useState("");
  const [explorerTab, setExplorerTab] = useState<"tables" | "relationships">(
    "tables",
  );
  const nameInput = useRef<HTMLInputElement>(null);
  const pendingNameFocus = useRef(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    session.start();
    const flush = () => session.flush();
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [session]);
  useEffect(() => {
    session.acknowledge(savedDiagram ?? initial);
  }, [session, savedDiagram, initial]);
  useEffect(() => {
    setNodes((previous) => {
      const byId = new Map(previous.map((node) => [node.id, node]));
      return [
        ...diagram.entities.map((e) =>
          byId.get(e.id)?.data.entity === e &&
          byId.get(e.id)?.selected === (selectedEntity === e.id)
            ? byId.get(e.id)!
            : {
                ...byId.get(e.id),
                id: e.id,
                type: "entity",
                selected: selectedEntity === e.id,
                position: e.position,
                data: { entity: e },
              },
        ),
        ...(diagram.strokes ?? []).map((stroke) => ({
          ...byId.get(stroke.id),
          id: stroke.id,
          type: "stroke",
          position: stroke.position,
          data: { stroke },
        })),
      ];
    });
  }, [diagram.entities, diagram.strokes, selectedEntity]);
  const commit = useCallback(
    (next: Diagram) => session.commit(next),
    [session],
  );
  const sqlFocus = useRef<string | null>(null);
  useEffect(() => {
    const id = sqlFocus.current;
    if (!id || !flow || !nodes.some((node) => node.id === id)) return;
    sqlFocus.current = null;
    void flow.fitView({
      nodes: [{ id }],
      padding: 0.7,
      maxZoom: 1.1,
      duration: 250,
    });
  }, [nodes, flow]);
  useEffect(() => {
    if (!sqlImport) return;
    const result = session.importSql(sqlImport);
    if (!result) return;
    if (!result.error) {
      setSearch("");
      setExplorerTab("tables");
      setPanelOpen(true);
      if (result.firstEntityId) {
        sqlFocus.current = result.firstEntityId;
        setSelectedEntity(result.firstEntityId);
        setSelectedRelation(null);
      }
    }
    const { firstEntityId: _, ...acknowledgment } = result;
    onSqlImportResult?.(acknowledgment);
  }, [sqlImport, session, onSqlImportResult]);
  const travel = (direction: "past" | "future") => session.travel(direction);
  const focusEntity = (id: string) => {
    setPanelOpen(true);
    if (explorerTab !== "tables") setSearch("");
    setExplorerTab("tables");
    setSelectedEntity(id);
    setSelectedRelation(null);
    void flow?.fitView({
      nodes: [{ id }],
      padding: 0.7,
      maxZoom: 1.1,
      duration: 250,
    });
  };
  const editEntity = (id: string, changes: Partial<Entity>) =>
    commit({
      ...session.diagram,
      entities: session.diagram.entities.map((e) =>
        e.id === id ? { ...e, ...changes } : e,
      ),
    });
  const editRelation = (id: string, changes: Partial<Relationship>) =>
    commit({
      ...session.diagram,
      relationships: session.diagram.relationships.map((r) =>
        r.id === id ? { ...r, ...changes } : r,
      ),
    });
  const selected = diagram.entities.find((e) => e.id === selectedEntity);
  const entityNames = useMemo(
    () => new Map(diagram.entities.map((entity) => [entity.id, entity.name])),
    [diagram.entities],
  );
  const query = search.trim().toLowerCase();
  const visibleEntities = useMemo(
    () =>
      diagram.entities.filter((entity) =>
        `${entity.name} ${entity.fields.map((field) => field.name).join(" ")}`
          .toLowerCase()
          .includes(query),
      ),
    [diagram.entities, query],
  );
  const visibleRelations = useMemo(
    () =>
      diagram.relationships.filter((item) =>
        `${entityNames.get(item.source)} ${entityNames.get(item.target)} ${item.label}`
          .toLowerCase()
          .includes(query),
      ),
    [diagram.relationships, entityNames, query],
  );
  useEffect(() => {
    if (pendingNameFocus.current && selected && panelOpen) {
      pendingNameFocus.current = false;
      nameInput.current?.focus();
      nameInput.current?.select();
    }
  }, [selected?.id, panelOpen]);
  const focusRelation = (id: string, fit = false) => {
    if (explorerTab !== "relationships") setSearch("");
    setSelectedRelation(id);
    setSelectedEntity(null);
    setPanelOpen(true);
    setExplorerTab("relationships");
    const item = session.diagram.relationships.find(
      (relation) => relation.id === id,
    );
    if (fit && item)
      void flow?.fitView({
        nodes: [{ id: item.source }, { id: item.target }],
        padding: 0.4,
        maxZoom: 1.1,
        duration: 250,
      });
  };
  const relation = diagram.relationships.find((r) => r.id === selectedRelation);
  const edges = useMemo(
    () =>
      diagram.relationships.map((r) => ({
        id: r.id,
        source: r.source,
        target: r.target,
        sourceHandle: r.source_handle ?? "right",
        targetHandle: r.target_handle ?? "left",
        selected: r.id === selectedRelation,
        type: "relation",
        data: { relation: r },
      })),
    [diagram.relationships, selectedRelation],
  );
  const onConnect = useCallback(
    (c: Connection) => {
      if (
        c.source &&
        c.target &&
        c.source !== c.target &&
        session.diagram.relationships.length < 300 &&
        !session.diagram.relationships.some(
          (r) => r.source === c.source && r.target === c.target,
        )
      ) {
        const r: Relationship = {
          ...defaultRelation(c.source, c.target),
          source_handle: c.sourceHandle as Relationship["source_handle"],
          target_handle: c.targetHandle as Relationship["target_handle"],
        };
        commit({
          ...session.diagram,
          relationships: [...session.diagram.relationships, r],
        });
        setSelectedRelation(r.id);
        setSelectedEntity(null);
        setPanelOpen(true);
        setExplorerTab("relationships");
        setSearch("");
      }
    },
    [commit],
  );
  const addEntity = () => {
    if (session.diagram.entities.length >= 100) return;
    const e: Entity = {
      id: uid(),
      name: nextName(
        session.diagram.entities.map((entity) => entity.name),
        kind === "star_schema"
          ? "dimension"
          : kind === "conceptual_erd"
            ? "entity"
            : "table",
      ),
      role: defaultRole(kind),
      annotation: "",
      position: {
        x: 80 + (diagram.entities.length % 4) * 260,
        y: 80 + Math.floor(diagram.entities.length / 4) * 180,
      },
      fields: [],
    };
    commit({ ...session.diagram, entities: [...session.diagram.entities, e] });
    setSelectedEntity(e.id);
    setSelectedRelation(null);
    setPanelOpen(true);
    setExplorerTab("tables");
    pendingNameFocus.current = true;
    setSearch("");
    requestAnimationFrame(
      () =>
        void flow?.fitView({
          nodes: [{ id: e.id }],
          padding: 0.7,
          maxZoom: 1.1,
          duration: 250,
        }),
    );
  };
  const removeEntity = () => {
    if (!selected) return;
    commit(removeElements(session.diagram, [selected.id]));
    setSelectedEntity(null);
  };
  const addField = () => {
    if (!selected || selected.fields.length >= 100) return;
    editEntity(selected.id, {
      fields: [
        ...selected.fields,
        {
          id: uid(),
          name: nextName(
            selected.fields.map((field) => field.name),
            "field",
          ),
          data_type: "",
          pk: false,
          fk: false,
        },
      ],
    });
  };
  const editField = (fieldId: string, changes: Partial<Field>) => {
    if (selected)
      editEntity(selected.id, {
        fields: selected.fields.map((f) =>
          f.id === fieldId ? { ...f, ...changes } : f,
        ),
      });
  };
  const nodeChanges = (changes: NodeChange[]) =>
    setNodes((old) => applyNodeChanges(changes, old));
  const edgeChanges = (changes: EdgeChange[]) => {
    for (const change of changes) {
      if (change.type === "select") {
        setSelectedRelation((selected) =>
          change.selected
            ? change.id
            : selected === change.id
              ? null
              : selected,
        );
      }
    }
  };
  return (
    <div
      ref={editorRoot}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as globalThis.Node | null,
          )
        )
          session.flush();
      }}
      className={`erd-editor ${expanded ? "erd-expanded" : ""} ${layout === "workspace" ? "erd-workspace" : ""} ${panelOpen ? "" : "erd-panel-hidden"}`}
      onKeyDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("input, textarea, select, [contenteditable=true]"))
          return;
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "z"
        ) {
          event.preventDefault();
          travel(event.shiftKey ? "future" : "past");
        } else if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "y"
        ) {
          event.preventDefault();
          travel("future");
        } else if (event.key === "Escape") {
          setDrawing(false);
          setSelectedEntity(null);
          setSelectedRelation(null);
        }
      }}
    >
      {exportError && (
        <div role="alert" className="erd-export-error">
          {exportError}
        </div>
      )}
      {conflictingDraft && (
        <div role="alert" className="erd-export-error">
          A local draft differs from the saved diagram. Review it before
          replacing the saved version.
          <button type="button" onClick={() => session.restoreDraft()}>
            Restore local draft
          </button>
          <button type="button" onClick={() => session.discardDraft()}>
            Discard local draft
          </button>
        </div>
      )}
      <div className="erd-toolbar">
        <div className="erd-brand">
          <span className="erd-brand-icon">
            <StudioIcon />
          </span>
          <div>
            <strong>Schema studio</strong>
            <small>{kind.replaceAll("_", " ")}</small>
          </div>
        </div>
        <button
          className="erd-primary"
          type="button"
          disabled={diagram.entities.length >= 100}
          onClick={addEntity}
        >
          + Add {kind === "conceptual_erd" ? "entity" : "table"}
        </button>
        <div className="erd-toolbar-group">
          <button
            type="button"
            aria-pressed={!drawing}
            onClick={() => setDrawing(false)}
          >
            Select
          </button>
          <button
            type="button"
            aria-pressed={drawing}
            disabled={(diagram.strokes?.length ?? 0) >= 200}
            onClick={() => setDrawing(true)}
          >
            Draw
          </button>
        </div>
        {drawing && (
          <div className="erd-draw-options">
            <label>
              Ink{" "}
              <input
                type="color"
                aria-label="Drawing color"
                value={drawColor}
                onChange={(event) => setDrawColor(event.target.value)}
              />
            </label>
            <label>
              Line{" "}
              <select
                aria-label="Drawing line width"
                value={drawWidth}
                onChange={(event) => setDrawWidth(Number(event.target.value))}
              >
                <option value={2}>Thin</option>
                <option value={3}>Medium</option>
                <option value={6}>Thick</option>
              </select>
            </label>
          </div>
        )}
        <div className="erd-toolbar-group">
          <button
            type="button"
            title="Undo (Ctrl/Cmd+Z outside text fields)"
            disabled={!canUndo}
            onClick={() => travel("past")}
          >
            Undo
          </button>
          <button
            type="button"
            title="Redo (Ctrl/Cmd+Shift+Z)"
            disabled={!canRedo}
            onClick={() => travel("future")}
          >
            Redo
          </button>
        </div>
        <button
          type="button"
          disabled={!diagram.entities.length}
          onClick={() => {
            commit(arrangeEntities(session.diagram));
            requestAnimationFrame(
              () => void flow?.fitView({ padding: 0.2, duration: 250 }),
            );
          }}
        >
          Tidy layout
        </button>
        <button
          type="button"
          onClick={() => void flow?.fitView({ padding: 0.2, duration: 250 })}
        >
          Fit view
        </button>
        {layout === "workspace" && (
          <>
            <button
              type="button"
              aria-expanded={panelOpen}
              onClick={() => setPanelOpen(!panelOpen)}
            >
              {panelOpen ? "Hide explorer" : "Show explorer"}
            </button>
            <button
              type="button"
              disabled={
                exporting ||
                (!diagram.entities.length && !diagram.strokes?.length)
              }
              onClick={async () => {
                if (!flow || !editorRoot.current) return;
                setExporting(true);
                setExportError("");
                try {
                  setExportImage(
                    await downloadDiagram(
                      editorRoot.current,
                      flow,
                      documentName,
                    ),
                  );
                } catch {
                  setExportError(
                    "Could not generate PNG. Try again or download JSON to preserve your diagram.",
                  );
                } finally {
                  setExporting(false);
                }
              }}
            >
              {exporting ? "Exporting..." : "Download PNG"}
            </button>
            {attemptLinked && (
              <button
                type="button"
                disabled={!!saveError || !!conflictingDraft}
                onClick={() => {
                  session.flush();
                  onReturn?.(session.diagram);
                }}
              >
                Save and return to attempt
              </button>
            )}
            <span
              role="status"
              className={`erd-save-state ${saveError ? "error" : isSaved ? "saved" : "pending"}`}
            >
              {saveError ? "Save failed" : isSaved ? "Saved" : "Saving…"}
            </span>
          </>
        )}
        {layout === "embedded" && (
          <button
            type="button"
            className="erd-expand"
            aria-pressed={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Compact view" : "Expand canvas"}
          </button>
        )}
      </div>
      {exportImage && (
        <details className="erd-export-preview">
          <summary>PNG ready - preview or save</summary>
          <a href={exportImage.url} download={exportImage.filename}>
            Save PNG
          </a>
          <img src={exportImage.url} alt="Exported diagram preview" />
        </details>
      )}
      <div className="erd-body">
        <aside className="erd-panel">
          <div className="erd-section-heading">
            Model explorer{" "}
            <span className="erd-count">{diagram.entities.length}</span>
          </div>
          <div
            className="erd-explorer-tabs"
            role="group"
            aria-label="Browse model"
          >
            <button
              type="button"
              aria-pressed={explorerTab === "tables"}
              onClick={() => {
                setExplorerTab("tables");
                setSelectedRelation(null);
                setSearch("");
              }}
            >
              {kind === "conceptual_erd" ? "Entities" : "Tables"}{" "}
              <span>{diagram.entities.length}</span>
            </button>
            <button
              type="button"
              aria-pressed={explorerTab === "relationships"}
              onClick={() => {
                setExplorerTab("relationships");
                setSelectedEntity(null);
                setSearch("");
              }}
            >
              Relationships <span>{diagram.relationships.length}</span>
            </button>
          </div>
          <input
            className="erd-search"
            aria-label={
              explorerTab === "tables"
                ? "Find a table or field"
                : "Find a relationship"
            }
            placeholder={
              explorerTab === "tables"
                ? "Find a name or field…"
                : "Find an endpoint or label…"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="erd-list">
            {explorerTab === "tables" &&
              visibleEntities.map((e) => (
                <button
                  type="button"
                  className={selectedEntity === e.id ? "active" : ""}
                  aria-pressed={selectedEntity === e.id}
                  key={e.id}
                  onClick={() => {
                    focusEntity(e.id);
                  }}
                >
                  <span className={`erd-role-dot ${e.role}`} />{" "}
                  <span>{e.name || "Untitled"}</span>
                  <small>{e.fields.length}</small>
                </button>
              ))}
            {explorerTab === "relationships" &&
              visibleRelations.map((item) => (
                <button
                  type="button"
                  className={
                    selectedRelation === item.id
                      ? "active erd-relation-item"
                      : "erd-relation-item"
                  }
                  aria-pressed={selectedRelation === item.id}
                  key={item.id}
                  onClick={() => focusRelation(item.id, true)}
                >
                  <span>
                    {entityNames.get(item.source)} →{" "}
                    {entityNames.get(item.target)}
                    <small>{item.label || "Unlabeled relationship"}</small>
                  </span>
                </button>
              ))}
          </div>
          {(explorerTab === "tables"
            ? !visibleEntities.length
            : !visibleRelations.length) && (
            <p className="erd-muted">
              {query
                ? "No matches. Try another name."
                : explorerTab === "tables"
                  ? "Add an entity to start your model."
                  : "Select a table and choose a connection, or drag between its handles."}
            </p>
          )}
          {selected && (
            <div className="erd-details">
              <div className="erd-section-heading">
                <h4>Properties</h4>
                <button
                  type="button"
                  disabled={diagram.entities.length >= 100}
                  onClick={() => {
                    const copy = {
                      ...selected,
                      id: uid(),
                      name: nextName(
                        session.diagram.entities.map((entity) => entity.name),
                        `${selected.name.slice(0, 185)}_copy`,
                      ),
                      fields: selected.fields.map((f) => ({ ...f, id: uid() })),
                      position: {
                        x: selected.position.x + 320,
                        y: selected.position.y + 40,
                      },
                    };
                    commit({
                      ...session.diagram,
                      entities: [...session.diagram.entities, copy],
                    });
                    setSelectedEntity(copy.id);
                    pendingNameFocus.current = true;
                  }}
                >
                  Duplicate
                </button>
              </div>
              <label>
                Name
                <input
                  ref={nameInput}
                  maxLength={200}
                  aria-label="Entity name"
                  value={selected.name}
                  onChange={(e) =>
                    editEntity(selected.id, { name: e.target.value })
                  }
                />
              </label>
              {kind === "star_schema" && (
                <label>
                  Table role
                  <select
                    aria-label="Entity role"
                    value={selected.role}
                    onChange={(e) =>
                      editEntity(selected.id, {
                        role: e.target.value as Entity["role"],
                      })
                    }
                  >
                    {(kind === "star_schema"
                      ? ["fact", "dimension"]
                      : kind === "logical_erd"
                        ? ["table"]
                        : ["entity"]
                    ).map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                {kind === "star_schema" ? "Grain / annotation" : "Annotation"}
                <textarea
                  maxLength={1000}
                  aria-label="Entity annotation"
                  value={selected.annotation}
                  onChange={(e) =>
                    editEntity(selected.id, { annotation: e.target.value })
                  }
                />
              </label>
              <label>
                Connect to another{" "}
                {kind === "conceptual_erd" ? "entity" : "table"}
                <select
                  aria-label="Connect to another table"
                  value=""
                  disabled={diagram.relationships.length >= 300}
                  onChange={(event) => {
                    if (event.target.value)
                      onConnect({
                        source: selected.id,
                        target: event.target.value,
                        sourceHandle: "right",
                        targetHandle: "left",
                      });
                  }}
                >
                  <option value="">Choose an endpoint…</option>
                  {diagram.entities
                    .filter(
                      (e) =>
                        e.id !== selected.id &&
                        !diagram.relationships.some(
                          (r) => r.source === selected.id && r.target === e.id,
                        ),
                    )
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                </select>
              </label>
              <div className="erd-section-heading">
                Fields{" "}
                <button
                  type="button"
                  disabled={selected.fields.length >= 100}
                  onClick={addField}
                >
                  + Field
                </button>
              </div>
              {!selected.fields.length && (
                <p className="erd-muted">
                  Add fields to describe this{" "}
                  {kind === "conceptual_erd" ? "entity" : "table"}. Mark
                  identifiers as primary keys and references as foreign keys.
                </p>
              )}
              {selected.fields.map((f, index) => (
                <div className="erd-field-edit" key={f.id}>
                  <input
                    maxLength={200}
                    aria-label="Field name"
                    value={f.name}
                    onChange={(e) => editField(f.id, { name: e.target.value })}
                  />
                  <input
                    maxLength={100}
                    aria-label="Field data type"
                    placeholder="Type"
                    list={`erd-types-${documentId}`}
                    value={f.data_type}
                    onChange={(e) =>
                      editField(f.id, { data_type: e.target.value })
                    }
                  />
                  <label>
                    <input
                      type="checkbox"
                      aria-label={`Primary key for ${f.name}`}
                      checked={f.pk}
                      onChange={(e) =>
                        editField(f.id, { pk: e.target.checked })
                      }
                    />{" "}
                    PK
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      aria-label={`Foreign key for ${f.name}`}
                      checked={f.fk}
                      onChange={(e) =>
                        editField(f.id, { fk: e.target.checked })
                      }
                    />{" "}
                    FK
                  </label>
                  <div className="erd-field-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      aria-label={`Move ${f.name} up`}
                      onClick={() =>
                        commit(
                          moveField(session.diagram, selected.id, f.id, -1),
                        )
                      }
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      disabled={index === selected.fields.length - 1}
                      aria-label={`Move ${f.name} down`}
                      onClick={() =>
                        commit(moveField(session.diagram, selected.id, f.id, 1))
                      }
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove field ${f.name}`}
                      onClick={() =>
                        editEntity(selected.id, {
                          fields: selected.fields.filter((x) => x.id !== f.id),
                        })
                      }
                    >
                      Remove field
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="erd-danger"
                onClick={removeEntity}
              >
                Delete {kind === "conceptual_erd" ? "entity" : "table"}
              </button>
            </div>
          )}
          {!selected && !relation && (
            <div className="erd-inspector-hint">
              <strong>Your model, one connection at a time.</strong>
              <p>
                Select a {kind === "conceptual_erd" ? "entity" : "table"} to
                edit its fields. Choose a connection in its properties or drag a
                green connector to another{" "}
                {kind === "conceptual_erd" ? "entity" : "table"}.
              </p>
              <small>
                PK · Primary key
                <br />
                FK · Foreign key
                <br />
                0..* · Zero or many
              </small>
            </div>
          )}
          {relation && (
            <div className="erd-details">
              <h4>Edit relationship</h4>
              <label>
                Label
                <input
                  maxLength={200}
                  aria-label="Relationship label"
                  value={relation.label}
                  onChange={(e) =>
                    editRelation(relation.id, { label: e.target.value })
                  }
                />
              </label>
              {(["source", "target"] as const).map((end) => (
                <div key={end}>
                  <strong>{entityNames.get(relation[end])}</strong>
                  <label>
                    Cardinality
                    <select
                      aria-label={`${end} cardinality`}
                      value={relation[`${end}_cardinality`]}
                      onChange={(e) =>
                        editRelation(relation.id, {
                          [`${end}_cardinality`]: e.target.value,
                        })
                      }
                    >
                      <option value="one">One</option>
                      <option value="many">Many</option>
                    </select>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={relation[`${end}_optional`]}
                      onChange={(e) =>
                        editRelation(relation.id, {
                          [`${end}_optional`]: e.target.checked,
                        })
                      }
                    />{" "}
                    Optional
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="erd-danger"
                onClick={() => {
                  commit({
                    ...session.diagram,
                    relationships: session.diagram.relationships.filter(
                      (r) => r.id !== relation.id,
                    ),
                  });
                  setSelectedRelation(null);
                }}
              >
                Delete relationship
              </button>
            </div>
          )}
        </aside>
        <div className="erd-canvas">
          {!diagram.entities.length && !diagram.strokes?.length && !drawing && (
            <div className="erd-empty">
              <span>
                <StudioIcon />
              </span>
              <h3>Give your data a structure</h3>
              <p>
                Add your first {kind === "conceptual_erd" ? "entity" : "table"},
                define its fields,
                <br />
                then connect the relationships.
              </p>
              <button type="button" onClick={addEntity}>
                + Create your first{" "}
                {kind === "conceptual_erd" ? "entity" : "table"}
              </button>
            </div>
          )}
          <ReactFlow
            nodesDraggable={!drawing}
            nodesConnectable={!drawing}
            elementsSelectable={!drawing}
            panOnDrag={!drawing}
            zoomOnScroll={!drawing}
            zoomOnPinch={!drawing}
            zoomOnDoubleClick={!drawing}
            deleteKeyCode={drawing ? null : ["Backspace", "Delete"]}
            onInit={setFlow}
            onPaneClick={() => {
              setSelectedEntity(null);
              setSelectedRelation(null);
            }}
            minZoom={0.1}
            maxZoom={1.8}
            snapToGrid
            snapGrid={[20, 20]}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={nodeChanges}
            onEdgesChange={edgeChanges}
            onDelete={({ nodes, edges }) =>
              commit(
                removeElements(
                  session.diagram,
                  nodes.map((node) => node.id),
                  edges.map((edge) => edge.id),
                ),
              )
            }
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              if (node.type === "stroke") {
                setSelectedEntity(null);
                setSelectedRelation(null);
                return;
              }
              setSelectedEntity(node.id);
              setSelectedRelation(null);
              setPanelOpen(true);
              if (explorerTab !== "tables") setSearch("");
              setExplorerTab("tables");
            }}
            onEdgeClick={(_, edge) => {
              focusRelation(edge.id);
            }}
            onNodeDragStop={(_, node, movedNodes) => {
              const positions = new Map(
                movedNodes.map((moved) => [moved.id, moved.position]),
              );
              positions.set(node.id, node.position);
              commit({
                ...session.diagram,
                ...(session.diagram.strokes
                  ? {
                      strokes: session.diagram.strokes.map((stroke) =>
                        positions.has(stroke.id)
                          ? { ...stroke, position: positions.get(stroke.id)! }
                          : stroke,
                      ),
                    }
                  : {}),
                entities: session.diagram.entities.map((entity) =>
                  positions.has(entity.id)
                    ? { ...entity, position: positions.get(entity.id)! }
                    : entity,
                ),
              });
            }}
            fitView
            fitViewOptions={{ padding: 0.25 }}
          >
            {drawing && (
              <DrawingLayer
                color={drawColor}
                width={drawWidth}
                onStroke={(stroke) => {
                  const strokes = session.diagram.strokes ?? [];
                  if (strokes.length >= 200) return;
                  commit({ ...session.diagram, strokes: [...strokes, stroke] });
                  if (strokes.length === 199) setDrawing(false);
                }}
              />
            )}
            <Background gap={20} size={1} color="#c9d6dc" />
            <Controls />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) =>
                (node.data.entity as Entity | undefined)?.role === "fact"
                  ? "#b59ee8"
                  : "#85bcb5"
              }
            />
            <svg>
              <defs>
                <marker
                  id="erd-crowfoot"
                  markerWidth="12"
                  markerHeight="12"
                  refX="11"
                  refY="6"
                  orient="auto"
                >
                  <path
                    d="M1 1 L11 6 L1 11 M1 6 L11 6"
                    stroke="#607889"
                    fill="none"
                  />
                </marker>
                <marker
                  id="erd-crowfoot-start"
                  markerWidth="12"
                  markerHeight="12"
                  refX="1"
                  refY="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M11 1 L1 6 L11 11 M11 6 L1 6"
                    stroke="#607889"
                    fill="none"
                  />
                </marker>
                <marker
                  id="erd-one"
                  markerWidth="8"
                  markerHeight="12"
                  refX="7"
                  refY="6"
                  orient="auto"
                >
                  <path d="M6 1 L6 11" stroke="#607889" fill="none" />
                </marker>
                <marker
                  id="erd-one-start"
                  markerWidth="8"
                  markerHeight="12"
                  refX="1"
                  refY="6"
                  orient="auto-start-reverse"
                >
                  <path d="M2 1 L2 11" stroke="#607889" fill="none" />
                </marker>
              </defs>
            </svg>
          </ReactFlow>
        </div>
      </div>
      <div className="erd-status">
        <span>
          <i /> {diagram.entities.length} tables / entities ·{" "}
          {diagram.relationships.length} relationships
        </span>
        <span>
          {drawing
            ? "Drag to draw · Escape to select"
            : "Drag to move · Select a drawing and press Delete · Scroll to zoom"}
        </span>
      </div>
      <datalist id={`erd-types-${documentId}`}>
        {[
          "INTEGER",
          "BIGINT",
          "VARCHAR",
          "BOOLEAN",
          "DATE",
          "TIMESTAMP",
          "DECIMAL(12,2)",
          "UUID",
        ].map((type) => (
          <option key={type} value={type} />
        ))}
      </datalist>
    </div>
  );
}
