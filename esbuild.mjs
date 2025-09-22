import { build } from "esbuild";
import pkg from "fs-extra";

const { copySync } = pkg;

const shared = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: true,
  treeShaking: true,
  platform: "neutral",
  sourcemap: true,
  target: ["esnext"],
  jsx: "automatic",
  external: ["react", "react-dom", "clsx"],
};

await build({ ...shared, format: "esm", outfile: "dist/index.mjs" });
await build({ ...shared, format: "cjs", outfile: "dist/index.cjs" });

copySync("src/assets", "dist/assets");
