import { afterEach, describe, expect, it, mock } from "bun:test"

import { typedFetch } from "./typed-fetch"

const MOCK_URL = "https://www.example.com"

const mockFetch = mock()

global.fetch = mockFetch

describe("typedFetch", () => {
  afterEach(() => {
    mockFetch.mockReset()
  })

  it("throws error if JSON is not valid", () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.reject(new Error("this is some invalid json")),
      ok: true
    })
    expect(typedFetch(MOCK_URL)).rejects.toThrow("Invalid JSON response")
  })

  it("returns JSON if response is ok and valid", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ value: "foo" }),
      ok: true
    })
    const result = await typedFetch(MOCK_URL)
    expect(result).toEqual({ value: "foo" })
  })

  it("throws error if response is not ok and json contains error", () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ error: "Authorization error" }),
      ok: false,
      statusText: "Unauthorized"
    })

    expect(typedFetch(MOCK_URL)).rejects.toThrow("Authorization error")
  })

  it("throws error with status text if response is not ok and json does not contain error", () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ value: "foo" }),
      ok: false,
      statusText: "Unauthorized"
    })

    expect(typedFetch(MOCK_URL)).rejects.toThrow("Unauthorized")
  })
})
