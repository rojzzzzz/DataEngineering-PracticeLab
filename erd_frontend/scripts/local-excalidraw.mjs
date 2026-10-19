const firebaseConfig = "VITE_APP_FIREBASE_CONFIG";
const upstreamProject = "excalidraw-room-persistence";
const credentialPatterns = [
  /AIza[0-9A-Za-z_-]{35}/,
  /\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{40,}/,
  /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

export function localExcalidraw() {
  return {
    name: "local-excalidraw",
    enforce: "pre",
    transform(code, id) {
      if (
        !id
          .replaceAll("\\", "/")
          .includes("/node_modules/@excalidraw/excalidraw/") ||
        !code.includes(firebaseConfig)
      )
        return null;

      // Excalidraw ships a precompiled environment object. Vite's `define`
      // cannot remove this unused Firebase configuration from that object.
      const pending = [this.parse(code)];
      const replacements = [];
      while (pending.length) {
        const node = pending.pop();
        if (!node || typeof node !== "object") continue;
        if (
          node.type === "Property" &&
          !node.computed &&
          (node.key.name ?? node.key.value) === firebaseConfig
        ) {
          const value = node.value;
          if (value.type !== "Literal" || typeof value.value !== "string")
            throw new Error(
              "Excalidraw Firebase configuration is not a string literal",
            );
          const config = JSON.parse(value.value);
          if (config.projectId !== upstreamProject)
            throw new Error(
              "Unexpected Excalidraw Firebase project configuration",
            );
          replacements.push([value.start, value.end]);
        }
        for (const value of Object.values(node)) {
          if (Array.isArray(value)) pending.push(...value);
          else if (value && typeof value === "object") pending.push(value);
        }
      }
      if (!replacements.length) return null;
      replacements.sort((a, b) => b[0] - a[0]);
      for (const [start, end] of replacements)
        code = code.slice(0, start) + JSON.stringify("{}") + code.slice(end);
      return { code, map: null };
    },
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (
          output.type === "chunk" &&
          credentialPatterns.some((pattern) => pattern.test(output.code))
        )
          this.error(
            `Credential-like value in generated JavaScript: ${output.fileName}`,
          );
      }
    },
  };
}
