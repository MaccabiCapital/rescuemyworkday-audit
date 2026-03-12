import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["server/index.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "dist/server/index.js",
  packages: "external",
  sourcemap: true,
});

console.log("Server built to dist/server/index.js");
