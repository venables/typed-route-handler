import { defineConfig } from "tsdown"

export default defineConfig([
  {
    entry: [
      "src/index.ts",
      "src/parsers/valibot.ts",
      "src/parsers/zod/v3.ts",
      "src/parsers/zod/v4.ts"
    ],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true
  }
])
