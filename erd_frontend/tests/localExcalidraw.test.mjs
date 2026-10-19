import assert from "node:assert/strict";
import test from "node:test";
import { parseAst } from "rollup/parseAst";
import { localExcalidraw } from "../scripts/local-excalidraw.mjs";

const dependency =
  "/frontend/node_modules/@excalidraw/excalidraw/dist/prod/chunk.js";
const context = { parse: parseAst };
const config = {
  apiKey: "PUBLIC_TEST_VALUE",
  projectId: "excalidraw-room-persistence",
  authDomain: "excalidraw-room-persistence.firebaseapp.com",
};

test("local builds remove upstream Firebase config while preserving adjacent options", () => {
  const source = `export const env = {VITE_APP_FIREBASE_CONFIG: ${JSON.stringify(JSON.stringify(config))}, VITE_APP_ENABLE_TRACKING: "false"};`;
  const plugin = localExcalidraw();
  for (const path of [dependency, dependency.replaceAll("/", "\\")]) {
    const result = plugin.transform.call(context, source, path);
    assert.ok(result);
    assert.doesNotThrow(() => parseAst(result.code));
    assert.ok(!result.code.includes(config.apiKey));
    assert.ok(!result.code.includes(config.projectId));
    assert.ok(result.code.includes('VITE_APP_FIREBASE_CONFIG: "{}"'));
    assert.ok(result.code.includes('VITE_APP_ENABLE_TRACKING: "false"'));
  }
});

test("the transform only changes the known bundled Excalidraw configuration", () => {
  const plugin = localExcalidraw();
  const source = `const env = {VITE_APP_FIREBASE_CONFIG: ${JSON.stringify(JSON.stringify(config))}};`;
  assert.equal(
    plugin.transform.call(context, source, "/frontend/src/config.js"),
    null,
  );
  assert.equal(
    plugin.transform.call(context, "export const value = 1;", dependency),
    null,
  );
  assert.throws(
    () =>
      plugin.transform.call(
        context,
        'const env = {VITE_APP_FIREBASE_CONFIG: "{}"};',
        dependency,
      ),
    /Unexpected Excalidraw Firebase project/,
  );
  assert.throws(
    () =>
      plugin.transform.call(
        context,
        "const env = {VITE_APP_FIREBASE_CONFIG: readConfig()};",
        dependency,
      ),
    /not a string literal/,
  );
});

test("builds reject credential patterns without printing their values", () => {
  const plugin = localExcalidraw();
  const googleKey = "AI" + "za" + "A".repeat(35);
  let message;
  plugin.generateBundle.call(
    {
      error: (value) => {
        message = value;
      },
    },
    {},
    {
      chunk: {
        type: "chunk",
        fileName: "fixture.js",
        code: JSON.stringify(googleKey),
      },
    },
  );
  assert.match(message, /fixture\.js/);
  assert.ok(!message.includes(googleKey));
  assert.doesNotThrow(() =>
    plugin.generateBundle.call(
      {
        error: (value) => {
          throw new Error(value);
        },
      },
      {},
      {
        chunk: {
          type: "chunk",
          fileName: "fixture.js",
          code: 'export const config = "{}";',
        },
      },
    ),
  );
});
