import { defineConfig } from "tsup"

export default defineConfig([
  // Server APIs
  {
    entry: ["lib/index.ts"],
    format: ["cjs", "esm"],
    external: ["next"],
    dts: true,
    sourcemap: true
  }
])
