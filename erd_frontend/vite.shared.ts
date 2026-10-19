import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export function editorConfig(entry: string, outDir: string, split = false) {
  return defineConfig({
    plugins: [react()],
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    build: {
      outDir,
      emptyOutDir: true,
      cssCodeSplit: false,
      lib: {
        entry,
        formats: ["es"],
        fileName: () => "editor.js",
        cssFileName: "editor",
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: !split,
          chunkFileNames: "chunks/[name]-[hash].js",
        },
      },
    },
  });
}
