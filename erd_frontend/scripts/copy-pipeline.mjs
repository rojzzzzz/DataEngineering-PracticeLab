import {
  cpSync,
  readFileSync,
  readdirSync,
  existsSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
cpSync(
  fileURLToPath(
    new URL("node_modules/@excalidraw/excalidraw/dist/prod/fonts", root),
  ),
  fileURLToPath(new URL("../static/pipeline/fonts", root)),
  { recursive: true },
);
const lock = JSON.parse(
  readFileSync(new URL("package-lock.json", root), "utf8"),
);
const notices = [
  readFileSync(new URL("PIPELINE_EXCALIDRAW_LICENSE.txt", root), "utf8"),
];
for (const [path, info] of Object.entries(lock.packages)) {
  if (!path || info.dev) continue;
  const directory = new URL(path + "/", root);
  if (!existsSync(directory)) continue;
  const names = readdirSync(directory).filter((name) =>
    /^(licen[sc]e|copying|notice)(\.|$)/i.test(name),
  );
  notices.push(
    `\n\n${path} ${info.version} (${info.license || "see package"})\n`,
  );
  for (const name of names) {
    try {
      notices.push(readFileSync(new URL(name, directory), "utf8"));
    } catch {
      /* Some packages use a LICENSE directory. */
    }
  }
}
const fontNotices = new URL("PIPELINE_FONT_LICENSES.txt", root);
if (existsSync(fontNotices)) notices.push(readFileSync(fontNotices, "utf8"));
writeFileSync(
  new URL("../static/pipeline/THIRD_PARTY_LICENSES.txt", root),
  notices.join("\n"),
);
