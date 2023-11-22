import { hello } from "./hello"

describe("hello()", () => {
  test('returns with a default name of "World"', () => {
    const response = hello()

    expect(response).toBe("👋 Hello World")
  })

  test('returns with a custom name of "Foo"', () => {
    const response = hello("Foo")

    expect(response).toBe("👋 Hello Foo")
  })
})
