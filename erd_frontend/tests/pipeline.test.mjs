import assert from "node:assert/strict";
import test from "node:test";
import {
  catalog,
  emptyDocument,
  markdown,
  review,
  validateLocal,
  advancedFields,
} from "../src/pipelineModel.ts";
const block = (id, kind, settings = {}) => ({
  id,
  type: "rectangle",
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  customData: { pipeline: { version: 1, kind, settings } },
});
test("pipeline review follows native bindings and exposes incomplete decisions", () => {
  const elements = [
    block("a", "ingestion", { scope: "incremental" }),
    block("b", "destination", { write: "merge", history: "scd2" }),
    {
      ...block("edge", "data-flow"),
      type: "arrow",
      startBinding: { elementId: "a" },
      endBinding: { elementId: "b" },
    },
  ];
  assert.equal(review(elements).length, 3);
  elements[0].customData.pipeline.settings.watermark = "updated_at";
  Object.assign(elements[1].customData.pipeline.settings, {
    mergeKeys: "id",
    businessKey: "id",
    validFrom: "start",
    validTo: "end",
    trackedColumns: "name",
  });
  assert.deepEqual(review(elements), []);
  elements[1].isDeleted = true;
  assert.match(review(elements)[0].message, /Bind both ends/);
});
test("documentation uses bound names and includes custom methods and unknown decisions", () => {
  const doc = emptyDocument("Orders");
  doc.elements = [
    block("a", "ingestion", {
      access: "api",
      pagination: "cursor",
      delivery: "custom:batch webhook",
      trigger: "scheduled",
    }),
    { id: "t", type: "text", containerId: "a", text: "Orders API" },
  ];
  doc.notes = "Decide on rate limits.";
  const text = markdown(doc);
  assert.match(text, /Orders API/);
  assert.match(text, /Pagination - Cursor/);
  assert.match(text, /batch webhook/);
  assert.match(text, /Schedule: Unspecified/);
  assert.match(text, /Decide on rate limits/);
});
test("review ignores deleted bindings and uses the first live bound label", () => {
  const elements = [
    block("a", "ingestion", { scope: "incremental" }),
    block("b", "destination"),
    {
      id: "old-label",
      type: "text",
      containerId: "a",
      text: "Deleted",
      isDeleted: true,
    },
    { id: "label", type: "text", containerId: "a", text: "Orders" },
    {
      ...block("edge", "data-flow"),
      type: "arrow",
      startBinding: { elementId: "a" },
      endBinding: { elementId: "b" },
      isDeleted: true,
    },
    {
      id: "plain-arrow",
      type: "arrow",
      startBinding: { elementId: "a" },
      endBinding: { elementId: "b" },
    },
  ];
  assert.deepEqual(review(elements), [
    { id: "a", message: "Orders: Choose an incremental watermark." },
    { id: "a", message: "Orders: This block has no pipeline connections." },
    {
      id: "b",
      message: "Destination: This block has no pipeline connections.",
    },
  ]);
});
test("catalog includes every requested method family and independent choices", () => {
  const text = JSON.stringify(catalog);
  for (const term of [
    "Full Load",
    "Incremental Load",
    "Backfill",
    "Snapshot",
    "CDC",
    "Offset/Limit",
    "Page/Size",
    "Cursor",
    "Keyset",
    "Link Header",
    "Kafka/Kinesis",
    "Webhooks",
    "Polling",
    "REST/GraphQL",
    "Database Query Pull",
    "Log-based Extraction",
    "File Drop / SFTP",
    "SaaS Connector",
    "Event Sourcing Replay",
    "Message Queue Drain",
    "INSERT",
    "APPEND",
    "UPSERT / MERGE",
    "MERGE (SQL MERGE)",
    "INSERT OVERWRITE",
    "OVERWRITE (Full Replace)",
    "TRUNCATE + INSERT",
    "DELETE + INSERT",
    "SCD Type 1",
    "SCD Type 2",
    "SCD Type 3",
    "SCD Type 6",
    "Upsert with Soft Delete",
    "Hard Delete",
    "Copy / Bulk Load",
    "Staging + Swap",
    "Partition Replace",
    "Micro-batch Write",
    "Streaming Sink Write",
    "Idempotent Write",
    "Write-Audit-Publish",
    "Delta Merge",
    "Iceberg Merge",
    "Hudi Upsert",
    "Insert-Only with Dedup View",
    "Z-Order / Optimize Write",
    "Compaction Write",
    "Time-Travel Append",
  ])
    assert.ok(text.includes(term), term);
  assert.equal(new Set(catalog.map((c) => c.id)).size, catalog.length);
  assert.ok(
    advancedFields({
      scope: "incremental",
      pagination: "cursor",
      write: "merge",
    }).length === 3,
  );
});
test("local limits reject oversized changes", () => {
  validateLocal(emptyDocument());
  const doc = emptyDocument();
  doc.elements = Array.from({ length: 2001 }, (_, i) =>
    block(String(i), "source"),
  );
  assert.throws(() => validateLocal(doc), /2,000/);
});
