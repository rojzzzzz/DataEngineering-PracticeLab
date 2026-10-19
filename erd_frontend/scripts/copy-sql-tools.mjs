import { mkdirSync, renameSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
mkdirSync(resolve(root, "static"), { recursive: true });
const chunks = resolve(root, "static/chunks");
const source = resolve(root, "src/sql_tools_assets");
for (const target of [chunks, source]) {
  const relativeTarget = relative(root, target);
  if (
    relativeTarget === ".." ||
    relativeTarget.startsWith(`..${sep}`) ||
    isAbsolute(relativeTarget)
  )
    throw new Error("Invalid asset directory");
}
rmSync(chunks, { recursive: true, force: true });
renameSync(
  resolve(source, "editor.js"),
  resolve(root, "static/sql-tools-editor.js"),
);
renameSync(resolve(source, "chunks"), chunks);
