import { describe, expect, it } from "bun:test"
import * as v from "valibot"
import { parseParams, safeParseParams } from "./valibot"

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

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.transform(Number), v.number())
})

describe("valibot", () => {
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

      expect(result.output).toEqual({
        id: 123
      })
    })

    it("rejects invalid next.js contexts", async () => {
      const result = await safeParseParams(invalidContext, paramsSchema)

      expect(result.success).toBe(false)
      expect(result.issues).toBeDefined()
    })
  })
})
