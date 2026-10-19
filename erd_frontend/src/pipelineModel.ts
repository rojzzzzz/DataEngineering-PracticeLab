import catalogData from "./pipelineCatalog.json" with { type: "json" };

export const catalog = catalogData;
export const blockKinds = [
  "source",
  "ingestion",
  "storage",
  "transformation",
  "quality",
  "orchestration",
  "destination",
];
export const kindLabel = (kind: string) =>
  ({
    quality: "Quality Check",
    "data-flow": "Data flow",
    "control-flow": "Control / dependency",
  })[kind] ?? kind[0].toUpperCase() + kind.slice(1);
export type Metadata = {
  version: 1;
  kind: string;
  settings: Record<string, string>;
};
// Excalidraw owns its element schema; the domain layer uses only this structural subset.
export type Element = {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDeleted?: boolean;
  text?: string;
  containerId?: string | null;
  fileId?: string | null;
  customData?: Record<string, unknown> & { pipeline?: Metadata };
  startBinding?: { elementId: string } | null;
  endBinding?: { elementId: string } | null;
  [key: string]: unknown;
};
export type Asset = {
  id: string;
  dataURL: string;
  mimeType: string;
  created: number;
  [key: string]: unknown;
};
export type PipelineDocument = {
  format: "constructor-pipeline";
  version: 1;
  name: string;
  notes: string;
  elements: Element[];
  appState: Record<string, unknown>;
  files: Record<string, Asset>;
};
export const emptyDocument = (
  name = "Untitled pipeline",
): PipelineDocument => ({
  format: "constructor-pipeline",
  version: 1,
  name,
  notes: "",
  elements: [],
  appState: {},
  files: {},
});
export function persistentState(state: Record<string, unknown>) {
  return Object.fromEntries(
    [
      "viewBackgroundColor",
      "gridSize",
      "gridStep",
      "gridModeEnabled",
      "scrollX",
      "scrollY",
      "zoom",
      "theme",
    ]
      .filter((k) => state[k] !== undefined)
      .map((k) => [k, state[k]]),
  );
}
export function validateLocal(doc: PipelineDocument) {
  if (
    doc.format !== "constructor-pipeline" ||
    doc.version !== 1 ||
    !Array.isArray(doc.elements) ||
    !doc.files ||
    typeof doc.files !== "object" ||
    !doc.appState ||
    typeof doc.appState !== "object"
  )
    throw new Error("Unsupported project format.");
  if (!doc.name?.trim() || doc.name.length > 200)
    throw new Error("Choose a name between 1 and 200 characters.");
  if (doc.elements.length > 2000)
    throw new Error("A project can contain at most 2,000 elements.");
  if (new TextEncoder().encode(JSON.stringify(doc)).length > 25 * 1024 * 1024)
    throw new Error("Project exceeds the 25 MiB limit.");
  for (const file of Object.values(doc.files)) {
    if (!file.dataURL?.startsWith(`data:${file.mimeType};base64,`))
      throw new Error("Images must contain embedded image data.");
    if (atob(file.dataURL.split(",")[1]).length > 5 * 1024 * 1024)
      throw new Error("Each image must be at most 5 MiB.");
  }
}
export function title(el: Element, elements: Element[]) {
  return (
    elements.find(
      (e) => !e.isDeleted && e.type === "text" && e.containerId === el.id,
    )?.text ||
    el.text ||
    kindLabel(el.customData?.pipeline?.kind || "shape")
  );
}
export type Finding = { id: string; message: string };
export function review(elements: Element[]): Finding[] {
  const active = elements.filter((e) => !e.isDeleted);
  const blocks = new Set<string>();
  const connected = new Set<string>();
  const labels = new Map<string, string>();
  for (const el of active) {
    if (
      el.type === "text" &&
      el.containerId &&
      el.text &&
      !labels.has(el.containerId)
    )
      labels.set(el.containerId, el.text);
    if (!el.customData?.pipeline) continue;
    if (el.type !== "arrow") blocks.add(el.id);
    else {
      if (el.startBinding) connected.add(el.startBinding.elementId);
      if (el.endBinding) connected.add(el.endBinding.elementId);
    }
  }
  const findings: Finding[] = [];
  for (const el of active) {
    const meta = el.customData?.pipeline;
    if (!meta) continue;
    const s = meta.settings;
    const add = (message: string) =>
      findings.push({
        id: el.id,
        message: `${labels.get(el.id) || el.text || kindLabel(meta.kind)}: ${message}`,
      });
    if (s.scope === "incremental" && !s.watermark?.trim())
      add("Choose an incremental watermark.");
    if (
      (s.write === "merge" || ["delta", "iceberg", "hudi"].includes(s.table)) &&
      !s.mergeKeys?.trim()
    )
      add("Specify merge keys.");
    if (
      ["scd2", "scd6"].includes(s.history) &&
      (!s.businessKey?.trim() ||
        !s.validFrom?.trim() ||
        !s.validTo?.trim() ||
        !s.trackedColumns?.trim())
    )
      add("Complete SCD history keys, tracked columns, and validity columns.");
    if (el.type === "arrow") {
      if (
        ![el.startBinding?.elementId, el.endBinding?.elementId].every(
          (id) => id !== undefined && blocks.has(id),
        )
      )
        add("Bind both ends to pipeline blocks.");
    } else if (!connected.has(el.id))
      add("This block has no pipeline connections.");
  }
  return findings;
}
export const operationalFields = [
  ["technology", "Technology"],
  ["format", "Data format"],
  ["schema", "Schema notes"],
  ["volume", "Expected volume"],
  ["freshness", "Freshness target"],
  ["retries", "Retry policy"],
  ["failure", "Failure destination"],
  ["owner", "Owner"],
  ["questions", "Open questions"],
];
export function advancedFields(s: Record<string, string>) {
  const fields: string[][] = [];
  if (s.scope === "incremental")
    fields.push(["watermark", "Watermark column / value"]);
  if (["cursor", "keyset"].includes(s.pagination))
    fields.push(["cursor", "Cursor token / key columns"]);
  if (s.scope === "backfill") fields.push(["backfill", "Backfill window"]);
  if (s.write === "merge" || ["delta", "iceberg", "hudi"].includes(s.table))
    fields.push(["mergeKeys", "Merge keys"]);
  if (["partition", "insert-overwrite", "delete-insert"].includes(s.write))
    fields.push(["partitionKeys", "Partition keys"]);
  if (s.history)
    fields.push(
      ["businessKey", "Business key"],
      ["trackedColumns", "Tracked columns"],
    );
  if (["scd2", "scd6"].includes(s.history))
    fields.push(
      ["validFrom", "Valid-from column"],
      ["validTo", "Valid-to column"],
    );
  if (["scd3", "scd6"].includes(s.history))
    fields.push(["previousColumns", "Previous-value columns"]);
  if (s.access === "cdc" || s.delivery === "stream" || s.loading === "stream")
    fields.push(["checkpoint", "Checkpoint / offset storage"]);
  if (s.reliability)
    fields.push(["dedupKeys", "Idempotency / deduplication keys"]);
  if (s.trigger === "scheduled" || s.delivery === "polling")
    fields.push(["schedule", "Schedule"]);
  if (s.deletion)
    fields.push(["deleteDetails", "Deletion rules / marker column"]);
  return fields;
}
export function markdown(doc: PipelineDocument) {
  const clean = (s: string) => s.replaceAll("\r", "").replaceAll("\n", " ");
  const active = doc.elements.filter((e) => !e.isDeleted);
  const lines = [
    `# ${clean(doc.name)}`,
    "",
    "## Planning notes",
    "",
    doc.notes || "Unspecified",
    "",
    "## Components",
    "",
  ];
  for (const el of active.filter(
    (e) => e.customData?.pipeline && e.type !== "arrow",
  )) {
    const meta = el.customData!.pipeline!;
    lines.push(
      `### ${clean(title(el, active))}`,
      "",
      `- Role: ${kindLabel(meta.kind)}`,
    );
    const fields = [
      ...catalog
        .filter((c) => !c.kinds.length || c.kinds.includes(meta.kind))
        .map((c) => [c.id, c.label]),
      ...advancedFields(meta.settings),
      ...operationalFields,
    ];
    const seen = new Set<string>();
    for (const [key, label] of [
      ...fields,
      ...Object.keys(meta.settings).map((k) => [k, k]),
    ]) {
      if (seen.has(key)) continue;
      seen.add(key);
      const val = meta.settings[key];
      const cat = catalog.find((c) => c.id === key);
      const display =
        cat?.options.find((o) => o[0] === val)?.[1] ??
        val?.replace(/^custom:/, "");
      lines.push(`- ${label}: ${clean(display || "Unspecified")}`);
    }
    lines.push("");
  }
  lines.push("## Connections", "");
  const edges = active.filter(
    (e) => e.type === "arrow" && e.customData?.pipeline,
  );
  for (const edge of edges) {
    const from = active.find((e) => e.id === edge.startBinding?.elementId),
      to = active.find((e) => e.id === edge.endBinding?.elementId);
    lines.push(
      `- ${from ? clean(title(from, active)) : "Unbound"} → ${to ? clean(title(to, active)) : "Unbound"} (${kindLabel(edge.customData!.pipeline!.kind)})`,
    );
    for (const [key, value] of Object.entries(
      edge.customData!.pipeline!.settings,
    ))
      lines.push(`  - ${key}: ${clean(value || "Unspecified")}`);
  }
  if (!edges.length) lines.push("Unspecified");
  const findings = review(active);
  lines.push(
    "",
    "## Design review",
    "",
    ...findings.map((f) => `- ${clean(f.message)}`),
  );
  if (!findings.length)
    lines.push(
      "No findings from the basic design checks. This does not validate runtime correctness.",
    );
  return lines.join("\n");
}
