import { defineConfig } from "tsup"

export default defineConfig([
  // Server APIs
  {
    entry: ["lib/index.ts"],
    format: ["cjs", "esm"],
    external: ["next"],
    dts: true,
    sourcemap: true
  },
  // Client APIs
  {
    entry: ["lib/client/index.ts"],
    outDir: "client",
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true
  }
])
