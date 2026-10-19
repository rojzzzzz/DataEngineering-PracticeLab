import assert from "node:assert/strict";
import test from "node:test";
import { SaveScheduler } from "../src/saveScheduler.ts";

test("text edits coalesce and navigation flushes the latest value", async () => {
  const saved = [];
  const queue = new SaveScheduler((value) => saved.push(value), 30);
  queue.queue("a");
  queue.queue("ab");
  queue.flush();
  assert.deepEqual(saved, ["ab"]);
  await new Promise((resolve) => setTimeout(resolve, 45));
  assert.deepEqual(saved, ["ab"]);
});

test("structural edits save immediately after pending text", () => {
  const saved = [];
  const queue = new SaveScheduler((value) => saved.push(value));
  queue.queue("draft");
  queue.queue("added table", true);
  assert.deepEqual(saved, ["added table"]);
});

test("typing settles into one delayed save", async () => {
  const saved = [];
  const queue = new SaveScheduler((value) => saved.push(value), 25);
  queue.queue("c");
  queue.queue("cu");
  queue.queue("customer");
  assert.deepEqual(saved, []);
  await new Promise((resolve) => setTimeout(resolve, 45));
  assert.deepEqual(saved, ["customer"]);
});
