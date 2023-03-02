import { hello } from "../lib"

test("hello() returns a promise of a friendly message", async () => {
  const response = await hello()

  expect(response).toBe("👋 Hello.")
})
