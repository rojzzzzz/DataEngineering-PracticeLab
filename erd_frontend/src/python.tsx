import type {
  FrontendRenderer,
  FrontendRendererArgs,
} from "@streamlit/component-v2-lib";
import { createRoot, type Root } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { basicSetup } from "codemirror";
import "./python.css";

type Data = {
  attemptId: number;
  exerciseHash: string;
  source: string;
  starter: string;
  busy: boolean;
  ready: boolean;
  checkReady: boolean;
  assessedSource: string | null;
};
type Event = {
  id: string;
  attemptId: number;
  exerciseHash: string;
  action: string;
  source: string;
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
  const mount = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const props = useRef({ data, emit, onPending });
  props.current = { data, emit, onPending };
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [source, setSource] = useState(data.source);
  const [confirmReset, setConfirmReset] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pending = source !== data.source;
  useEffect(() => {
    props.current.onPending(pending);
  }, [pending]);
  const send = (action: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
    const current = props.current;
    if (
      ["run", "check"].includes(action) &&
      (current.data.busy ||
        !current.data.ready ||
        (action === "check" && !current.data.checkReady))
    )
      return;
    current.emit({
      id: crypto.randomUUID(),
      attemptId: current.data.attemptId,
      exerciseHash: current.data.exerciseHash,
      action,
      source: view.current?.state.doc.toString() ?? current.data.source,
    });
  };
  useEffect(() => {
    if (!mount.current) return;
    const editor = new EditorView({
      parent: mount.current,
      state: EditorState.create({
        doc: data.source,
        extensions: [
          basicSetup,
          python(),
          EditorView.contentAttributes.of({
            "aria-label": "Python code editor",
            spellcheck: "false",
          }),
          keymap.of([
            {
              key: "Mod-Shift-Enter",
              run: () => {
                send("check");
                return true;
              },
            },
            {
              key: "Mod-Enter",
              run: () => {
                send("run");
                return true;
              },
            },
          ]),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;
            setSource(update.state.doc.toString());
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => send("save"), 750);
          }),
          EditorView.domEventHandlers({
            blur: () => {
              if (timer.current) send("save");
            },
          }),
        ],
      }),
    });
    view.current = editor;
    return () => {
      if (timer.current) send("save");
      editor.destroy();
      view.current = null;
    };
  }, []);
  return (
    <section
      className={`python-workspace${expanded ? " python-expanded" : ""}`}
      aria-label="Python studio"
    >
      <div className="python-filebar">
        <strong>solution.py</strong>
        <span className="python-runtime">
          {data.busy
            ? "Executing…"
            : data.ready
              ? "Python ready"
              : "Runner offline"}
        </span>
        <button aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Compact editor" : "Expand editor"}
        </button>
      </div>
      <div className="python-toolbar">
        <button
          title="Run the complete file · Ctrl/Cmd+Enter"
          disabled={data.busy || !data.ready}
          onClick={() => send("run")}
        >
          Run
        </button>
        <button
          className="python-primary"
          title="Check correctness, time, and memory · Ctrl/Cmd+Shift+Enter"
          disabled={data.busy || !data.ready || !data.checkReady}
          onClick={() => send("check")}
        >
          Check answer
        </button>
        {data.busy && <button onClick={() => send("cancel")}>Cancel</button>}
        <button
          className="python-reset-button"
          onClick={() => setConfirmReset(true)}
        >
          Reset starter code
        </button>
      </div>
      {confirmReset && (
        <div className="python-reset">
          Replace your current draft with the starter code?
          <button
            onClick={() => {
              const editor = view.current;
              if (editor)
                editor.dispatch({
                  changes: {
                    from: 0,
                    to: editor.state.doc.length,
                    insert: data.starter,
                  },
                });
              send("save");
              setConfirmReset(false);
            }}
          >
            Reset to starter code
          </button>
          <button onClick={() => setConfirmReset(false)}>Keep draft</button>
        </div>
      )}
      <div ref={mount} />
      <div className="python-caption">
        <span role="status">
          {source === data.source ? "Saved" : "Saving…"}
        </span>
        <span>Ctrl/Cmd+Enter to run · +Shift to check</span>
        <span>Fresh process each run</span>
        {data.assessedSource !== null && source !== data.assessedSource && (
          <span className="python-outdated" role="status">
            Assessment outdated — check again
          </span>
        )}
      </div>
    </section>
  );
}

const roots = new WeakMap<FrontendRendererArgs["parentElement"], Root>();
const render: FrontendRenderer<
  { event: Event | null; pending: boolean },
  Data | [Data]
> = ({ data: payload, parentElement, setStateValue }) => {
  const data = componentData(payload);
  const mount = parentElement.querySelector(".python-root");
  if (!mount) throw new Error("Python mount missing");
  let root = roots.get(parentElement);
  if (!root) {
    root = createRoot(mount);
    roots.set(parentElement, root);
  }
  root.render(
    <Workspace
      key={`${data.attemptId}:${data.exerciseHash}`}
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
