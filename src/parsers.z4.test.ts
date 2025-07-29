import { describe, expect, it } from "bun:test"
import * as z from "zod/v4"
import { parseParams, safeParseParams } from "./parsers"

const validContext = {
  params: Promise.resolve({
    id: "123"
  })
}

const invalidContext = {
  params: Promise.resolve({
    id: "banana"
  })
}

const paramsSchema = z.object({
  id: z.coerce.number()
})

describe("zod/v4", () => {
  describe("parseParams()", () => {
    it("parses valid next.js context", async () => {
      const params = await parseParams(validContext, paramsSchema)

      expect(params).toEqual({
        id: 123
      })
    })

    it("rejects invalid next.js contexts", () => {
      expect(parseParams(invalidContext, paramsSchema)).rejects.toThrow()
    })
  })

  describe("safeParseParams()", () => {
    it("performs a safe parse", async () => {
      const result = await safeParseParams(validContext, paramsSchema)
      if (result.issues) {
        throw new Error("Failed to parse params")
      }
    })

    it("rejects invalid next.js contexts", async () => {
      const result = await safeParseParams(invalidContext, paramsSchema)

      expect(result.issues).toBeDefined()
    })
  })
})
