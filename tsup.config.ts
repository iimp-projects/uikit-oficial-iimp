import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  banner: { js: '"use client"' },
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ["react", "react-dom"],
  loader: { ".png": "dataurl" },
})
