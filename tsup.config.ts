import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  target: "es2020",
  minify: true,
  format: ["esm", "cjs", "iife"],
  clean: true,
  dts: true,
  outDir: "dist",
  entry: ["index.ts"],
  globalName: "predictNextRandom",
  esbuildOptions: (options) => {
    if (options.format === "cjs") {
      options.footer = {
        js: "module.exports = module.exports.default;",
      };
    }
    else if (options.format === "iife") {
      options.footer = {
        js: "window.predictNextRandom = window.predictNextRandom.default;",
      };
    }
  }
}));