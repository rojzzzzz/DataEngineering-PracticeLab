import type {
  FrontendRenderer,
  FrontendRendererArgs,
} from "@streamlit/component-v2-lib";
import { createRoot, type Root } from "react-dom/client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { basicSetup } from "codemirror";
import {
  sql,
  PostgreSQL,
  MySQL,
  MSSQL,
  SQLite,
  StandardSQL,
} from "@codemirror/lang-sql";
import {
  defaults,
  readWorkspace,
  responseMatches,
  type Settings,
  type GraphData,
} from "./sqlToolsModel";
import "@xyflow/react/dist/style.css";
import "./sqlTools.css";

type Result = { sql?: string; diagnostics?: string[] } & Partial<GraphData>;
const GraphViewer = lazy(() => import("./GraphViewer"));
type Response = {
  workspaceId: string;
  id: string;
  revision: number;
  action: string;
  ok: boolean;
  result?: Result;
  error?: string;
};
type Data = {
  attemptLinked?: boolean;
  document?: SQLDocument;
  artifactRevision?: number;
  saveAck?: { id: string; ok: boolean; revision: number; error?: string };
  workspaceId: string;
  dialects: Record<
    string,
    { label: string; parser: string; formatter: string }
  >;
  response?: Response;
};
type Request = {
  workspaceId: string;
  id: string;
  revision: number;
  action: string;
  sql: string;
  plan: string;
  dialect: string;
  target: string;
  statement: number;
  planFormat: string;
  keywordCase: Settings["keywordCase"];
  tabWidth: Settings["tabWidth"];
  lineLength: Settings["lineLength"];
};
type Panel = "Format" | "Convert" | "Visualize SQL" | "Explain Plan";
type AnalysisEntry = {
  revision: number;
  result: Result;
  inputs: Record<string, unknown>;
};
type SQLDocument = {
  format: "constructor-sql-workspace";
  version: 1;
  sql: string;
  plan: string;
  settings: Settings;
  panel: Panel;
  revision: number;
  reviewed_sql: string;
  results: Record<string, AnalysisEntry>;
};
type DraftEvent = {
  workspaceId: string;
  id: string;
  baseRevision: number;
  payload: SQLDocument;
  returnToAttempt?: boolean;
};
const panels: Panel[] = ["Format", "Convert", "Visualize SQL", "Explain Plan"];

function Editor({
  value,
  onChange,
  dialect = "postgres",
  readOnly = false,
  label,
}: {
  value: string;
  onChange?: (value: string) => void;
  dialect?: string;
  readOnly?: boolean;
  label: string;
}) {
  const mount = useRef<HTMLDivElement>(null),
    view = useRef<EditorView | null>(null);
  const languageConfig = useRef(new Compartment());
  const current = useRef({ value, onChange });
  current.current = { value, onChange };
  useEffect(() => {
    const language =
      (
        {
          postgres: PostgreSQL,
          mysql: MySQL,
          tsql: MSSQL,
          sqlite: SQLite,
        } as Record<string, typeof StandardSQL>
      )[dialect] || StandardSQL;
    const editor = new EditorView({
      parent: mount.current!,
      state: EditorState.create({
        doc: current.current.value,
        extensions: [
          basicSetup,
          languageConfig.current.of(sql({ dialect: language })),
          EditorView.lineWrapping,
          EditorState.readOnly.of(readOnly),
          EditorView.contentAttributes.of({ "aria-label": label }),
          EditorView.updateListener.of((update) => {
            if (
              update.docChanged &&
              update.state.doc.toString() !== current.current.value
            )
              current.current.onChange?.(update.state.doc.toString());
          }),
        ],
      }),
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
  }, [readOnly, label]);
  useEffect(() => {
    const language =
      (
        {
          postgres: PostgreSQL,
          mysql: MySQL,
          tsql: MSSQL,
          sqlite: SQLite,
        } as Record<string, typeof StandardSQL>
      )[dialect] || StandardSQL;
    view.current?.dispatch({
      effects: languageConfig.current.reconfigure(sql({ dialect: language })),
    });
  }, [dialect]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value)
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: value },
      });
  }, [value]);
  return <div className="sut-editor" ref={mount} />;
}

const exampleSQL =
  "WITH recent_orders AS (SELECT customer_id, amount FROM orders WHERE amount > 100) SELECT c.id, r.amount FROM customers c LEFT JOIN recent_orders r ON c.id = r.customer_id UNION ALL SELECT customer_id, amount FROM archived_orders;";
const exampleJinja =
  "{{ config(materialized='incremental') }}\n\nwith orders as (select customer_id, amount, created_at from {{ ref('stg_orders') }}) select customer_id, sum(amount) as total_amount from orders\n{% if is_incremental() %}\nwhere created_at > (select max(created_at) from {{ this }})\n{% endif %}\ngroup by customer_id";
const examplePlan = JSON.stringify(
  [
    {
      Plan: {
        "Node Type": "Hash Join",
        "Join Type": "Inner",
        "Startup Cost": 12,
        "Total Cost": 45,
        "Plan Rows": 100,
        "Hash Cond": "(orders.customer_id = customers.id)",
        Plans: [
          {
            "Node Type": "Seq Scan",
            "Relation Name": "orders",
            "Plan Rows": 1000,
          },
          {
            "Node Type": "Hash",
            Plans: [
              {
                "Node Type": "Seq Scan",
                "Relation Name": "customers",
                "Plan Rows": 100,
              },
            ],
          },
        ],
      },
    },
  ],
  null,
  2,
);

const exampleAnalyzedPlan = JSON.stringify(
  [
    {
      "Planning Time": 0.42,
      "Execution Time": 38.6,
      Plan: {
        "Node Type": "Sort",
        "Startup Cost": 150,
        "Total Cost": 151,
        "Plan Rows": 100,
        "Actual Startup Time": 36.2,
        "Actual Total Time": 37.1,
        "Actual Rows": 12000,
        "Actual Loops": 1,
        "Sort Key": ["orders.amount DESC"],
        "Sort Method": "external merge",
        "Sort Space Type": "Disk",
        "Sort Space Used": 1024,
        "Shared Hit Blocks": 420,
        "Temp Read Blocks": 128,
        "Temp Written Blocks": 130,
        Plans: [
          {
            "Node Type": "Seq Scan",
            "Parent Relationship": "Outer",
            "Relation Name": "orders",
            Alias: "orders",
            "Startup Cost": 0,
            "Total Cost": 120,
            "Plan Rows": 100,
            "Actual Startup Time": 0.02,
            "Actual Total Time": 18.4,
            "Actual Rows": 12000,
            "Actual Loops": 1,
            Filter: "(amount > 100)",
            "Rows Removed by Filter": 8000,
            "Shared Hit Blocks": 420,
          },
        ],
      },
    },
  ],
  null,
  2,
);

function Workspace({
  data,
  emit,
  saveDraft,
  onBusy,
}: {
  data: Data;
  emit: (request: Request) => void;
  saveDraft: (event: DraftEvent) => void;
  onBusy: (busy: boolean) => void;
}) {
  const recoveryKey = `attempt-sql:${data.workspaceId}`;
  const [startup] = useState(() => {
    if (!data.attemptLinked)
      return { document: data.document, conflict: null as SQLDocument | null };
    try {
      const recovered = JSON.parse(
        sessionStorage.getItem(recoveryKey) || "null",
      );
      if (recovered?.baseRevision === data.artifactRevision)
        return { document: recovered.payload as SQLDocument, conflict: null };
      if (
        recovered?.payload &&
        JSON.stringify(recovered.payload) !== JSON.stringify(data.document)
      )
        return {
          document: data.document,
          conflict: recovered.payload as SQLDocument,
        };
    } catch {
      /* Browser recovery is best effort; database remains authoritative. */
    }
    return { document: data.document, conflict: null };
  });
  const initial = startup.document;
  const [conflictingDraft, setConflictingDraft] = useState(startup.conflict);
  const [source, setSource] = useState(initial?.sql || ""),
    [plan, setPlan] = useState(initial?.plan || ""),
    [settings, setSettings] = useState<Settings>(
      initial?.settings || { ...defaults },
    ),
    [panel, setPanel] = useState<Panel>(initial?.panel || "Format"),
    [reviewedSQL, setReviewedSQL] = useState(initial?.reviewed_sql || "");
  const [revision, setRevision] = useState(initial?.revision || 0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [results, setResults] = useState<Record<string, AnalysisEntry>>(
    initial?.results || {},
  );
  const pending = useRef<string | null>(null),
    rev = useRef(initial?.revision || 0);
  const requestInputs = useRef<Record<string, unknown>>({});
  const persisted = useRef(JSON.stringify(data.document));
  const baseRevision = useRef(data.artifactRevision || 0);
  const saving = useRef<{ id: string; signature: string } | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const seenAck = useRef("");
  const returning = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const payload: SQLDocument = {
    format: "constructor-sql-workspace",
    version: 1,
    sql: source,
    plan,
    settings,
    panel,
    revision,
    reviewed_sql: reviewedSQL,
    results,
  };
  const signature = JSON.stringify(payload);
  const latest = useRef(payload);
  latest.current = payload;
  function persist(returnToAttempt = false) {
    if (!data.attemptLinked) return;
    if (conflictingDraft) return;
    returning.current ||= returnToAttempt;
    if (returnToAttempt) setLeaving(true);
    if (saving.current || (saveError && !returnToAttempt)) return;
    const signature = JSON.stringify(latest.current);
    if (signature === persisted.current && !returning.current) return;
    const id = crypto.randomUUID();
    saving.current = { id, signature };
    setSaveStatus("Saving…");
    saveDraft({
      workspaceId: data.workspaceId,
      id,
      baseRevision: baseRevision.current,
      payload: latest.current,
      returnToAttempt: returning.current,
    });
  }
  useEffect(() => {
    if (!data.attemptLinked || conflictingDraft) return;
    try {
      sessionStorage.setItem(
        recoveryKey,
        JSON.stringify({ baseRevision: baseRevision.current, payload }),
      );
    } catch {
      setSaveError(
        "Browser recovery storage is unavailable. Download your workspace if saving fails.",
      );
    }
    const timer = setTimeout(() => persist(), 150);
    return () => clearTimeout(timer);
  }, [signature]);
  useEffect(() => {
    if (data.attemptLinked)
      onBusy(
        !!conflictingDraft ||
          signature !== persisted.current ||
          saveStatus !== "Saved",
      );
  }, [signature, saveStatus, conflictingDraft]);
  useEffect(() => {
    const ack = data.saveAck;
    if (!ack || ack.id === seenAck.current || ack.id !== saving.current?.id)
      return;
    seenAck.current = ack.id;
    const sent = saving.current;
    saving.current = null;
    if (!ack.ok) {
      setSaveError(ack.error || "Save failed");
      setSaveStatus("Save failed");
      returning.current = false;
      setLeaving(false);
      return;
    }
    baseRevision.current = ack.revision;
    persisted.current = sent.signature;
    setSaveError("");
    setSaveStatus("Saved");
    try {
      if (JSON.stringify(latest.current) === persisted.current)
        sessionStorage.removeItem(recoveryKey);
      else
        sessionStorage.setItem(
          recoveryKey,
          JSON.stringify({
            baseRevision: baseRevision.current,
            payload: latest.current,
          }),
        );
    } catch {
      /* Saved server copy is available. */
    }
    persist();
  }, [data.saveAck]);
  const uploads = useRef<HTMLInputElement>(null),
    plans = useRef<HTMLInputElement>(null),
    sqlFile = useRef<HTMLInputElement>(null);
  function cancel() {
    pending.current = null;
    setBusy(false);
  }
  function changed() {
    cancel();
    rev.current++;
    setRevision(rev.current);
    setError("");
    setNotice("");
  }
  const editSQL = (value: string) => {
    changed();
    setSource(value);
  };
  const editPlan = (value: string) => {
    changed();
    setPlan(value);
  };
  function option<K extends keyof Settings>(key: K, value: Settings[K]) {
    changed();
    setSettings((old) => ({ ...old, [key]: value }));
  }
  useEffect(() => {
    const response = data.response;
    if (
      !response ||
      !responseMatches(response, data.workspaceId, pending.current, rev.current)
    )
      return;
    pending.current = null;
    setBusy(false);
    if (response.ok && response.result) {
      setResults((old) => ({
        ...old,
        [response.action]: {
          revision: response.revision,
          result: response.result!,
          inputs: requestInputs.current,
        },
      }));
      setError("");
    } else setError(response.error || "Analysis failed.");
  }, [data.response, data.workspaceId]);
  function run(action: string) {
    cancel();
    setError("");
    setNotice("");
    const inputSQL =
      data.attemptLinked && action === "visualize" && reviewedSQL.trim()
        ? reviewedSQL
        : source;
    const inputSettings =
      data.attemptLinked && action === "visualize" && reviewedSQL.trim()
        ? { ...settings, dialect: settings.target }
        : settings;
    if (
      action !== "explain" &&
      (!inputSQL.trim() || inputSQL.length > 200000)
    ) {
      setError("Enter SQL, up to 200,000 characters.");
      return;
    }
    if (
      action === "explain" &&
      (!plan.trim() || new TextEncoder().encode(plan).length > 2000000)
    ) {
      setError("Paste a plan up to 2 MB.");
      return;
    }
    const id = crypto.randomUUID(),
      at = rev.current;
    pending.current = id;
    requestInputs.current = {
      sql: inputSQL,
      plan,
      settings: { ...inputSettings },
    };
    setBusy(true);
    emit({
      workspaceId: data.workspaceId,
      id,
      revision: at,
      action,
      sql: inputSQL,
      plan,
      dialect: inputSettings.dialect,
      target: settings.target,
      statement: settings.statement - 1,
      planFormat: settings.planFormat,
      keywordCase: settings.keywordCase,
      tabWidth: settings.tabWidth,
      lineLength: settings.lineLength,
    });
  }
  const action = (
    {
      Format: "format",
      Convert: "convert",
      "Visualize SQL": "visualize",
      "Explain Plan": "explain",
    } as const
  )[panel];
  const entry = results[action],
    result = entry?.result,
    stale = !!entry && entry.revision !== revision;
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Copied.");
    } catch {
      setError(
        "Clipboard unavailable. Select the output to copy, or download it.",
      );
    }
  }
  function downloadText(text: string, type: string, filename: string) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function upload(
    file: File | undefined,
    kind: "workspace" | "plan" | "sql",
  ) {
    if (!file) return;
    try {
      if (
        file.size >
        (kind === "workspace" ? 3000000 : kind === "plan" ? 2000000 : 800000)
      )
        throw new Error("File is too large.");
      const text = await file.text();
      if (kind === "workspace") {
        const value = readWorkspace(text, Object.keys(data.dialects));
        changed();
        setSource(value.sql);
        setPlan(value.plan);
        setSettings(value.settings);
        setResults({});
      } else if (kind === "plan") editPlan(text);
      else {
        if (text.length > 200000)
          throw new Error("SQL exceeds 200,000 characters.");
        editSQL(text);
      }
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <section className="sut" inert={leaving || undefined}>
      <p className="sut-note">
        {data.attemptLinked
          ? `Attempt deliverable · ${saveStatus}`
          : "Temporary workspace. Download anything you want to keep. Closing this tool or refreshing clears it."}
      </p>
      {data.attemptLinked && (
        <>
          <button disabled={!!saving.current} onClick={() => persist(true)}>
            Save and return to attempt
          </button>
          {conflictingDraft && (
            <p role="alert">
              A recovery draft was based on another saved revision. Download it
              before choosing the saved version.
              <button
                onClick={() =>
                  downloadText(
                    JSON.stringify(conflictingDraft),
                    "application/json",
                    "sql-recovery.json",
                  )
                }
              >
                Download recovery draft
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem(recoveryKey);
                  setConflictingDraft(null);
                }}
              >
                Keep saved version
              </button>
            </p>
          )}
          {saveError && (
            <p role="alert">
              {saveError}{" "}
              <button
                onClick={() => {
                  setSaveError("");
                  persist(true);
                }}
              >
                Retry save and return
              </button>
            </p>
          )}
          <h3>Final reviewed SQL</h3>
          <Editor
            value={reviewedSQL}
            onChange={(value) => {
              changed();
              setReviewedSQL(value);
            }}
            dialect={settings.target}
            label="Final reviewed SQL"
          />
          <p>
            Review semantics yourself. Conversion and visualization do not
            verify correctness or performance.
          </p>
        </>
      )}
      <div className="sut-actions sut-files">
        <button onClick={() => uploads.current?.click()}>
          Open workspace JSON
        </button>
        <button
          onClick={() =>
            downloadText(
              JSON.stringify(
                {
                  ...(data.attemptLinked ? latest.current : {}),
                  format: "constructor-sql-workspace",
                  version: 1,
                  sql: source,
                  plan,
                  settings,
                },
                null,
                2,
              ),
              "application/json",
              "sql-workspace.json",
            )
          }
        >
          Download workspace
        </button>
        <button onClick={() => sqlFile.current?.click()}>Open SQL file</button>
        <button
          onClick={() => downloadText(source, "text/plain", "source.sql")}
        >
          Download source SQL
        </button>
        <input
          ref={uploads}
          type="file"
          accept=".json"
          hidden
          onChange={(e) => {
            void upload(e.target.files?.[0], "workspace");
            e.target.value = "";
          }}
        />
        <input
          ref={sqlFile}
          type="file"
          accept=".sql,.sql.jinja,.jinja,.j2,.txt"
          hidden
          onChange={(e) => {
            void upload(e.target.files?.[0], "sql");
            e.target.value = "";
          }}
        />
      </div>
      <div className="sut-tabs" role="tablist" aria-label="SQL tools">
        {panels.map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={name === panel}
            onClick={() => setPanel(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="sut-options">
        {panel !== "Explain Plan" && panel !== "Format" && (
          <label>
            Source dialect
            <select
              value={settings.dialect}
              onChange={(e) => option("dialect", e.target.value)}
            >
              {Object.entries(data.dialects).map(([id, d]) => (
                <option key={id} value={id}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {panel === "Convert" && (
          <label>
            Target dialect
            <select
              value={settings.target}
              onChange={(e) => option("target", e.target.value)}
            >
              {Object.entries(data.dialects).map(([id, d]) => (
                <option key={id} value={id}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {panel === "Format" && (
          <>
            <label>
              Keyword case
              <select
                value={settings.keywordCase}
                onChange={(e) =>
                  option(
                    "keywordCase",
                    e.target.value as Settings["keywordCase"],
                  )
                }
              >
                <option value="upper">Uppercase</option>
                <option value="lower">Lowercase</option>
                <option value="preserve">Preserve</option>
              </select>
            </label>
            <label>
              Indentation
              <select
                value={settings.tabWidth}
                onChange={(e) =>
                  option("tabWidth", Number(e.target.value) as 2 | 4)
                }
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </label>
            <label>
              Line width
              <select
                value={settings.lineLength}
                onChange={(e) =>
                  option(
                    "lineLength",
                    Number(e.target.value) as Settings["lineLength"],
                  )
                }
              >
                {[80, 88, 100, 120].map((width) => (
                  <option key={width} value={width}>
                    {width} characters
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {panel === "Visualize SQL" && (
          <label>
            Statement number
            <input
              type="number"
              min={1}
              value={settings.statement}
              onChange={(e) =>
                option("statement", Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>
        )}
        {panel === "Explain Plan" && (
          <label>
            Plan format
            <select
              value={settings.planFormat}
              onChange={(e) =>
                option("planFormat", e.target.value as Settings["planFormat"])
              }
            >
              <option value="auto">Automatic</option>
              <option value="json">PostgreSQL JSON</option>
              <option value="text">PostgreSQL text</option>
            </select>
          </label>
        )}
        <button
          className="sut-primary"
          disabled={busy}
          onClick={() => run(action)}
        >
          {busy
            ? "Working..."
            : panel === "Format"
              ? "Format SQL"
              : panel === "Convert"
                ? "Convert SQL"
                : panel === "Visualize SQL"
                  ? "Visualize query"
                  : "Inspect plan"}
        </button>
        {busy && <button onClick={cancel}>Cancel</button>}
      </div>
      {panel === "Format" && (
        <p className="sut-note">
          Jinja is recognized automatically, including dbt expressions and
          control blocks. Formatting keeps template contents intact.
        </p>
      )}
      {error && (
        <p className="sut-error" role="alert">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {panel === "Explain Plan" ? (
        <>
          <p>
            Paste PostgreSQL EXPLAIN output. To obtain JSON in your database:{" "}
            <code>EXPLAIN (FORMAT JSON) SELECT ...;</code> Existing EXPLAIN
            ANALYZE output is also accepted. This tool never executes SQL.
          </p>
          <div className="sut-actions">
            <button onClick={() => plans.current?.click()}>
              Open plan file
            </button>
            <button onClick={() => editPlan(examplePlan)}>
              Load example plan (replaces input)
            </button>
            <button onClick={() => editPlan(exampleAnalyzedPlan)}>
              Load ANALYZE example (replaces input)
            </button>
            <button
              onClick={() =>
                downloadText(
                  plan,
                  "text/plain",
                  settings.planFormat === "json" ||
                    (settings.planFormat === "auto" && /^[\s]*[\[{]/.test(plan))
                    ? "plan.json"
                    : "plan.txt",
                )
              }
            >
              Download plan
            </button>
            <input
              ref={plans}
              type="file"
              accept=".json,.txt"
              hidden
              onChange={(e) => {
                void upload(e.target.files?.[0], "plan");
                e.target.value = "";
              }}
            />
          </div>
          <textarea
            className="sut-plan-input"
            aria-label="PostgreSQL EXPLAIN output"
            value={plan}
            onChange={(e) => editPlan(e.target.value)}
            placeholder="Paste raw JSON or standard indented EXPLAIN output"
          />
        </>
      ) : (
        <>
          <div className="sut-actions">
            <button onClick={() => editSQL(exampleSQL)}>
              Load example query (replaces input)
            </button>
            {panel === "Format" && (
              <button onClick={() => editSQL(exampleJinja)}>
                Load Jinja example (replaces input)
              </button>
            )}
            <span>{source.length.toLocaleString()} / 200,000 characters</span>
          </div>
          <div
            className={`sut-editors ${panel === "Format" || panel === "Convert" ? "sut-split" : ""}`}
          >
            <div>
              <h3>Source SQL</h3>
              <Editor
                value={source}
                onChange={editSQL}
                dialect={settings.dialect}
                label="Source SQL"
              />
            </div>
            {(panel === "Format" || panel === "Convert") && (
              <div>
                <h3>
                  {panel === "Format" ? "Formatted SQL" : "Converted SQL"}
                </h3>
                <Editor
                  readOnly
                  value={result?.sql || ""}
                  dialect={
                    panel === "Convert" ? settings.target : settings.dialect
                  }
                  label="SQL output"
                />
                {result?.sql && (
                  <div className="sut-actions">
                    <button onClick={() => copy(result.sql!)}>
                      Copy output
                    </button>
                    <button
                      onClick={() =>
                        downloadText(
                          result.sql!,
                          "text/plain",
                          panel === "Format"
                            ? "formatted.sql"
                            : "converted.sql",
                        )
                      }
                    >
                      Download SQL
                    </button>
                    <button
                      disabled={stale}
                      onClick={() => {
                        editSQL(result.sql!);
                        if (panel === "Convert")
                          setSettings((old) => ({
                            ...old,
                            dialect: old.target,
                          }));
                      }}
                    >
                      Replace input
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {stale && (
        <p className="sut-stale" role="status">
          Result is outdated. Run this action again for the current input and
          settings.
        </p>
      )}
      {result?.diagnostics?.map((message, i) => (
        <p className="sut-note" key={i}>
          {message}
        </p>
      ))}
      {result?.nodes && result.edges && (
        <Suspense fallback={<p>Loading graph…</p>}>
          <GraphViewer
            graph={result as GraphData}
            tree={panel === "Explain Plan"}
          />
        </Suspense>
      )}
    </section>
  );
}

const roots = new WeakMap<FrontendRendererArgs["parentElement"], Root>();
const render: FrontendRenderer<
  { request: Request | null; draft: DraftEvent | null; busy: boolean },
  Data | [Data]
> = ({ data: payload, parentElement, setStateValue }) => {
  const data = componentData(payload);
  const mount = parentElement.querySelector(".sql-tools-root");
  if (!mount) throw new Error("SQL tools mount missing");
  let root = roots.get(parentElement);
  if (!root) {
    root = createRoot(mount);
    roots.set(parentElement, root);
  }
  root.render(
    <Workspace
      key={data.workspaceId}
      data={data}
      emit={(request) => setStateValue("request", request)}
      saveDraft={(event) => setStateValue("draft", event)}
      onBusy={(busy) => setStateValue("busy", busy)}
    />,
  );
  return () => {
    roots.get(parentElement)?.unmount();
    roots.delete(parentElement);
  };
};
export default render;
import { componentData } from "./componentData";
