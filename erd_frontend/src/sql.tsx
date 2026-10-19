import type {
  FrontendRenderer,
  FrontendRendererArgs,
} from "@streamlit/component-v2-lib";
import { createRoot, type Root } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { basicSetup } from "codemirror";
import { quoteIdentifier, selectQuery } from "./sql_helpers";
import "./sql.css";

type Task = {
  id: string;
  title: string;
  description: string;
  ordered: boolean;
  columns: { name: string; type: string; scale?: number }[];
};
type Data = {
  executionOnly?: boolean;
  tables: {
    name: string;
    description: string;
    rowCount: number;
    columns: { name: string; type: string; nullable: boolean; key?: string }[];
    samples: unknown[][];
  }[];
  ddl: string;
  attemptId: number;
  exerciseHash: string;
  drafts: Record<string, string>;
  tasks: Task[];
  schema: Record<string, string[]>;
  busy: boolean;
  active: string;
  savedDrafts: Record<string, string>;
  detective?: boolean;
  notebooks?: string[];
  notebookTitles?: Record<string, string>;
  recoveryScope?: string;
};
type Event = {
  id: string;
  attemptId: number;
  exerciseHash: string;
  action: string;
  drafts: Record<string, string>;
  active: string;
  selection: string;
};

function Workspace({
  data,
  emit,
  onPending,
}: {
  data: Data;
  emit: (event: Event) => void;
  onPending: (pending: boolean) => void;
}) {
  const recoveryKey = `capstone-sql:${data.recoveryScope || `${data.attemptId}:${data.exerciseHash}`}`;
  const [recovery] = useState(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem(recoveryKey) || "null");
      if (
        value &&
        typeof value.drafts === "object" &&
        value.drafts !== null &&
        Object.entries(value.drafts).every(
          ([k, v]) =>
            (k === "scratch" ||
              data.tasks.some((t) => t.id === k) ||
              (data.notebooks || []).includes(k)) &&
            typeof v === "string" &&
            v.length <= 50000,
        )
      )
        return value;
    } catch {
      /* Storage may be unavailable. Server persistence still applies. */
    }
    return null;
  });
  const recoverable =
    recovery &&
    JSON.stringify(recovery.drafts) !== JSON.stringify(data.savedDrafts);
  const autoRecover =
    recoverable &&
    JSON.stringify(recovery.base) === JSON.stringify(data.savedDrafts);
  const [active, setActive] = useState(data.active);
  const [drafts, setDrafts] = useState<Record<string, string>>(
    autoRecover ? recovery.drafts : data.drafts,
  );
  const [search, setSearch] = useState("");
  const [tableName, setTableName] = useState(data.tables[0]?.name || "");
  const [columns, setColumns] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [selectionLength, setSelectionLength] = useState(0);
  const [notice, setNotice] = useState("");
  const states = useRef(new Map<string, EditorState>());
  const createState = useRef<((doc: string) => EditorState) | undefined>(
    undefined,
  );
  const mount = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const current = useRef(drafts);
  const activeRef = useRef(active);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const props = useRef({ data, emit, onPending });
  props.current = { data, emit, onPending };
  const retain = () => {
    try {
      sessionStorage.setItem(
        recoveryKey,
        JSON.stringify({
          base: props.current.data.savedDrafts,
          drafts: current.current,
        }),
      );
    } catch {
      /* Persistence failures remain visible through the saved indicator. */
    }
  };
  const send = (action: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
    const editor = view.current;
    if (editor)
      current.current = {
        ...current.current,
        [activeRef.current]: editor.state.doc.toString(),
      };
    if (props.current.data.busy && ["run", "explain", "check"].includes(action))
      return;
    props.current.emit({
      id: crypto.randomUUID(),
      attemptId: props.current.data.attemptId,
      exerciseHash: props.current.data.exerciseHash,
      action,
      drafts: { ...current.current },
      active: activeRef.current,
      selection: editor
        ? editor.state.sliceDoc(
            editor.state.selection.main.from,
            editor.state.selection.main.to,
          )
        : "",
    });
  };
  useEffect(() => {
    if (!mount.current) return;
    createState.current = (doc: string) =>
      EditorState.create({
        doc,
        extensions: [
          basicSetup,
          sql({ dialect: PostgreSQL, schema: data.schema }),
          EditorView.contentAttributes.of({
            "aria-label": "SQL query editor",
            spellcheck: "false",
          }),
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                send("run");
                return true;
              },
            },
          ]),
          EditorView.updateListener.of((update) => {
            if (update.selectionSet || update.docChanged)
              setSelectionLength(
                update.state.selection.main.to -
                  update.state.selection.main.from,
              );
            if (!update.docChanged) return;
            current.current = {
              ...current.current,
              [activeRef.current]: update.state.doc.toString(),
            };
            setDrafts(current.current);
            retain();
            if (props.current.data.executionOnly) props.current.onPending(true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => send("save"), 750);
          }),
          EditorView.domEventHandlers({
            blur: () => {
              if (timer.current) send("save");
            },
          }),
          EditorView.theme({
            "&": { fontSize: "14px" },
            ".cm-scroller": { overflow: "auto" },
          }),
        ],
      });
    const editor = new EditorView({
      parent: mount.current,
      state: createState.current(current.current[activeRef.current] || ""),
    });
    view.current = editor;
    if (autoRecover) {
      props.current.onPending(true);
      timer.current = setTimeout(() => send("save"), 0);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
      editor.destroy();
      view.current = null;
    };
  }, []);
  const changeTab = (id: string) => {
    if (id === activeRef.current) return;
    const editor = view.current;
    if (editor) states.current.set(activeRef.current, editor.state);
    activeRef.current = id;
    setActive(id);
    if (editor && createState.current)
      editor.setState(
        states.current.get(id) ||
          createState.current(current.current[id] || ""),
      );
    setSelectionLength(
      editor
        ? editor.state.selection.main.to - editor.state.selection.main.from
        : 0,
    );
    send("save");
  };
  const insert = (text: string) => {
    const editor = view.current;
    if (!editor) return;
    editor.dispatch(editor.state.replaceSelection(text));
    editor.focus();
    setNotice("Inserted into the active tab. Review the query before running.");
  };
  const table = data.tables.find((t) => t.name === tableName);
  const task = data.tasks.find((item) => item.id === active);
  const saved = JSON.stringify(drafts) === JSON.stringify(data.savedDrafts);
  useEffect(() => {
    props.current.onPending(!saved);
  }, [saved]);
  useEffect(() => {
    if (!saved) retain();
    if (saved && (!recoverable || autoRecover)) {
      try {
        sessionStorage.removeItem(recoveryKey);
      } catch {
        /* optional recovery */
      }
    }
  }, [saved, data.savedDrafts, data.executionOnly]);
  return (
    <div className={`sql-workspace ${expanded ? "sql-expanded" : ""}`}>
      {recoverable && !autoRecover && (
        <div role="status">
          Saved work changed since the browser draft.{" "}
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(recovery.drafts, null, 2)], {
                  type: "application/json",
                }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = "recovered-sql-drafts.json";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download earlier browser draft
          </button>
        </div>
      )}
      <header className="sql-header">
        <div className="sql-brand">
          <span>⌘</span>
          <div>
            <strong>SQL studio</strong>
            <small>Explore · query · verify</small>
          </div>
        </div>
        <span className="sql-engine">DuckDB · read only</span>
        <button
          type="button"
          aria-pressed={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Compact editor" : "Expand editor"}
        </button>
      </header>
      <div className="sql-layout">
        <aside className="sql-explorer" aria-label="Dataset explorer">
          <div className="sql-section-title">
            Dataset explorer <span>{data.tables.length} tables</span>
          </div>
          <input
            aria-label="Search tables and columns"
            placeholder="Find a table or column…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="sql-table-list">
            {data.tables
              .filter((t) =>
                `${t.name} ${t.columns.map((c) => c.name).join(" ")}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((t) => (
                <button
                  type="button"
                  key={t.name}
                  aria-pressed={tableName === t.name}
                  onClick={() => {
                    setTableName(t.name);
                    setColumns([]);
                  }}
                >
                  <strong>▤ {t.name}</strong>
                  <span>{t.rowCount} rows</span>
                </button>
              ))}
          </div>
          {search &&
            !data.tables.some((t) =>
              `${t.name} ${t.columns.map((c) => c.name).join(" ")}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            ) && <p className="sql-muted">No matching tables or columns.</p>}
          {table && (
            <>
              <h3>{table.name}</h3>
              <p className="sql-muted">{table.description}</p>
              <div className="sql-section-title">
                Columns <span>Click a name to insert</span>
              </div>
              <div className="sql-column-list">
                {table.columns.map((c) => (
                  <div className="sql-column" key={c.name}>
                    <input
                      type="checkbox"
                      aria-label={`Include ${c.name} in SELECT`}
                      checked={columns.includes(c.name)}
                      onChange={(e) =>
                        setColumns(
                          e.target.checked
                            ? [...columns, c.name]
                            : columns.filter((n) => n !== c.name),
                        )
                      }
                    />
                    <div>
                      <button
                        type="button"
                        title={`Insert ${c.name}`}
                        onClick={() => insert(quoteIdentifier(c.name))}
                      >
                        {c.name}
                      </button>
                      <small>
                        {c.type} · {c.nullable ? "nullable" : "not null"}
                      </small>
                      {c.key && <span className="sql-key">{c.key}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="sql-build"
                onClick={() =>
                  insert(
                    selectQuery(
                      table.name,
                      table.columns
                        .filter((c) => columns.includes(c.name))
                        .map((c) => c.name),
                    ),
                  )
                }
              >
                + Insert SELECT{" "}
                {columns.length ? `(${columns.length} columns)` : "*"}
              </button>
              <p className="sql-mini">
                Select columns to build a query. Inserts at the cursor; does not
                execute.
              </p>
              <details className="sql-samples">
                <summary>Sample rows · first {table.samples.length}</summary>
                <div className="sql-sample-scroll">
                  <table>
                    <thead>
                      <tr>
                        {table.columns.map((c) => (
                          <th key={c.name}>{c.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.samples.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>
                              {cell === null ? <em>NULL</em> : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!table.samples.length && (
                  <p className="sql-muted">This table is empty.</p>
                )}
              </details>
            </>
          )}
          <details className="sql-ddl">
            <summary>Schema DDL</summary>
            <pre>{data.ddl}</pre>
          </details>
        </aside>
        <main className="sql-main">
          <div className="sql-tabs" role="tablist" aria-label="SQL answer tabs">
            {[
              ...data.tasks,
              ...(data.detective
                ? (data.notebooks || []).map((id, index) => ({
                    id,
                    title: data.notebookTitles?.[id] || `Notebook ${index + 1}`,
                  }))
                : [{ id: "scratch", title: "Scratch · ungraded" }]),
            ].map((item) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === item.id}
                key={item.id}
                onClick={() => changeTab(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="sql-contract">
            <p>
              {task?.description ||
                (data.detective
                  ? "Explore the visible dataset here. Notebook SQL is never assessed."
                  : "Explore the visible dataset here. Scratch SQL is never assessed.")}
            </p>
            {task && !data.executionOnly && (
              <div>
                <div className="sql-section-title">
                  Expected output <span>{task.columns.length} columns</span>
                </div>
                <div className="sql-output-columns">
                  {task.columns.map((c) => (
                    <span key={c.name}>
                      <strong>{c.name}</strong>
                      <small>
                        {c.type}
                        {c.scale === undefined ? "" : ` · ${c.scale} decimals`}
                      </small>
                    </span>
                  ))}
                </div>
                {!data.executionOnly && (
                  <p className="sql-mini">
                    {task.ordered
                      ? "Row order is assessed as specified above."
                      : "Row order is not assessed; duplicates still count."}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="sql-editor-label">
            <span>
              {task ? task.title : data.detective ? "Notebook" : "Scratch"}{" "}
              <small>.sql</small>
            </span>
            <span>
              {selectionLength
                ? `${selectionLength} characters selected`
                : "Ctrl / ⌘ + Enter to run"}
            </span>
          </div>
          <div ref={mount} className="sql-code" />
          <div className="sql-toolbar">
            <button
              type="button"
              disabled={data.busy}
              onClick={() => send("run")}
            >
              {selectionLength && !data.executionOnly
                ? "Run selection"
                : "▶ Run query"}
            </button>
            {!data.executionOnly && (
              <>
                <button
                  type="button"
                  disabled={data.busy}
                  onClick={() => send("explain")}
                >
                  Explain
                </button>
                <button
                  type="button"
                  disabled={data.busy}
                  onClick={() => send("check")}
                >
                  {data.detective ? "Check repair" : "Check all answers"}
                </button>
              </>
            )}
            <button
              type="button"
              disabled={!data.busy}
              onClick={() => send("cancel")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                send("save");
                const contents = [
                  ...data.tasks,
                  ...(data.detective
                    ? (data.notebooks || []).map((id, index) => ({
                        id,
                        title:
                          data.notebookTitles?.[id] || `Notebook ${index + 1}`,
                      }))
                    : [{ id: "scratch", title: "Scratch (ungraded)" }]),
                ]
                  .map((t) => `-- ${t.title}\n${current.current[t.id] || ""}`)
                  .join("\n\n");
                const url = URL.createObjectURL(
                  new Blob([contents], { type: "text/plain;charset=utf-8" }),
                );
                const link = document.createElement("a");
                link.href = url;
                link.download = `attempt_${data.attemptId}.sql`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              Download SQL
            </button>
            <span aria-live="polite">
              {data.busy
                ? "Running…"
                : saved
                  ? "Saved"
                  : "Saving draft… previous results may be outdated"}
            </span>
          </div>
          {notice && (
            <div className="sql-notice" role="status">
              {notice}
              <button
                type="button"
                aria-label="Dismiss insertion notice"
                onClick={() => setNotice("")}
              >
                ×
              </button>
            </div>
          )}
          <div className="sql-footnote">
            One SELECT, WITH or WITH RECURSIVE statement per run.{" "}
            {data.executionOnly
              ? "Run saves execution evidence, not a correctness grade. CTEs do not materialize a warehouse."
              : `${data.detective ? "Notebook tabs are" : "Scratch is"} ungraded. Checks never reveal solutions.`}
          </div>
        </main>
      </div>
    </div>
  );
}

const roots = new WeakMap<FrontendRendererArgs["parentElement"], Root>();
const render: FrontendRenderer<
  { event: Event | null; pending: boolean },
  Data | [Data]
> = ({ data: payload, parentElement, setStateValue }) => {
  const data = componentData(payload);
  const mount = parentElement.querySelector(".sql-root");
  if (!mount) throw new Error("SQL mount missing");
  let root = roots.get(parentElement);
  if (!root) {
    root = createRoot(mount);
    roots.set(parentElement, root);
  }
  root.render(
    <Workspace
      key={`${data.recoveryScope || ""}:${data.attemptId}:${data.exerciseHash}:${(data.notebooks || []).join(",")}`}
      data={data}
      emit={(event) => setStateValue("event", event)}
      onPending={(pending) => setStateValue("pending", pending)}
    />,
  );
  return () => {
    roots.get(parentElement)?.unmount();
    roots.delete(parentElement);
  };
};
export default render;
import { componentData } from "./componentData";
