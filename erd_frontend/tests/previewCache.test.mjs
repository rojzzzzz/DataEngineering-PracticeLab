import { test } from "node:test";
import assert from "node:assert/strict";
import { PreviewCache } from "../src/previewCache.ts";

test("preview retention observes both bytes and entry count, keeping recent hits", () => {
  const cache = new PreviewCache(12, 2);
  cache.set("first", "abc");
  cache.set("second", "def");
  assert.equal(cache.get("first"), "abc");
  cache.set("third", "ghi");
  assert.equal(cache.get("second"), undefined);
  assert.equal(cache.get("first"), "abc");
  cache.set("large", "12345");
  assert.equal(cache.get("first"), undefined);
  assert.equal(cache.get("third"), undefined);
  assert.equal(cache.get("large"), "12345");
});

test("replacement releases old accounting and oversized previews are not retained", () => {
  const cache = new PreviewCache(12);
  cache.set("one", "abc");
  cache.set("one", "x");
  cache.set("two", "12345");
  assert.equal(cache.get("one"), "x");
  cache.set("two", "1234567");
  assert.equal(cache.get("two"), undefined);
  cache.set("three", "12345");
  assert.equal(cache.get("one"), "x");
  assert.equal(cache.get("three"), "12345");
});
