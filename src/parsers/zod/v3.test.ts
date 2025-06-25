import { describe, expect, it } from "bun:test"
import { z } from "zod"
import { parseParams, safeParseParams } from "./v3"

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

describe("zod/v3", () => {
  describe("parseParams()", () => {
    it("parses valid next.js context", async () => {
      const params = await parseParams(validContext, paramsSchema)
      expect(params).toEqual({
        id: 123
      })
    })

    it("rejects invalid next.js contexts", async () => {
      expect(parseParams(invalidContext, paramsSchema)).rejects.toThrow()
    })
  })

  describe("safeParseParams()", () => {
    it("performs a safe parse", async () => {
      const result = await safeParseParams(validContext, paramsSchema)
      if (!result.success) {
        throw new Error("Failed to parse params")
      }
    })

    it("rejects invalid next.js contexts", async () => {
      const result = await safeParseParams(invalidContext, paramsSchema)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
