import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss(), react(), dts({ insertTypesEntry: true, outDir: "dist" })],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    cssCodeSplit: true,
    sourcemap: true,
    lib: {
      // FRIMOUSSE VA DENTRO, NO FUERA: su CommonJS 0.4.0 viene roto de origen
      // (`return_optionalChain is not defined`, codex), y empaquetado desde su
      // ESM sale bien en las dos salidas. Sólo lo carga la entrada `emoji`.
      //
      // TRES ENTRADAS: el editor y los emojis van aparte para que quien no
      // los use no cargue TipTap ni frimousse.
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        editor: path.resolve(__dirname, "src/editor.ts"),
        emoji: path.resolve(__dirname, "src/emoji.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, nombre) => `${nombre}.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "tailwindcss",
        /^@tiptap\//,
      ],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM", tailwindcss: "tailwindcss" },
      },
    },
  },
});
