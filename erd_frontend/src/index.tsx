import type {
  FrontendRenderer,
  FrontendRendererArgs,
} from "@streamlit/component-v2-lib";
import { createRoot, type Root } from "react-dom/client";
import Editor from "./Editor";
import DiagramPreview from "./DiagramPreview";
import PreviewBoundary from "./PreviewBoundary";
import { componentData } from "./componentData";
import type { Diagram } from "./model";
import type { SqlImport } from "./sqlDiagram";
import "@xyflow/react/dist/style.css";
import "./style.css";

type State = {
  busy: boolean;
  return_request: { diagram: Diagram; id: string } | null;
  diagram: Diagram;
  sql_import_result: { id: string; error?: string; message?: string } | null;
};
type Data = {
  readOnly?: boolean;
  diagram: Diagram;
  documentId: string;
  kind: string;
  layout?: "embedded" | "workspace";
  documentName?: string;
  savedDiagram?: Diagram;
  saveError?: string | null;
  sqlImport?: SqlImport | null;
  attemptLinked?: boolean;
};
const roots = new WeakMap<FrontendRendererArgs["parentElement"], Root>();
const render: FrontendRenderer<State, Data | [Data]> = ({
  data: payload,
  parentElement,
  setStateValue,
  setTriggerValue,
}) => {
  const data = componentData(payload);
  const mount = parentElement.querySelector(".erd-root");
  if (!mount) throw new Error("ERD mount element missing");
  let root = roots.get(parentElement);
  if (!root) {
    root = createRoot(mount);
    roots.set(parentElement, root);
  }
  root.render(
    data.readOnly ? (
      <PreviewBoundary key={data.documentId}>
        <DiagramPreview diagram={data.diagram} />
      </PreviewBoundary>
    ) : (
      <Editor
        key={data.documentId}
        {...data}
        onSave={(diagram) => setStateValue("diagram", diagram)}
        onReturn={(diagram) =>
          setStateValue("return_request", { diagram, id: crypto.randomUUID() })
        }
        onBusy={(busy) => setStateValue("busy", busy)}
        onSqlImportResult={(value) =>
          setTriggerValue("sql_import_result", value)
        }
      />
    ),
  );
  return () => {
    roots.get(parentElement)?.unmount();
    roots.delete(parentElement);
  };
};
export default render;
