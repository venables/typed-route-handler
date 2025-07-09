import { describe, expect, it } from "bun:test"
import { NextRequest, NextResponse } from "next/server.js"
import type { Handler } from "./handler"
import { handler } from "./handler"

const createMockRequest = (url = "http://localhost:3000/api/test") => {
  return new NextRequest(url)
}

const createMockContext = <T>(params: T) => ({
  params: Promise.resolve(params)
})

describe("Handler type", () => {
  it("allows usage without a response type", async () => {
    const GET: Handler = async () => {
      return NextResponse.json({ message: "Hello World" })
    }

    const request = createMockRequest()
    const context = createMockContext({})

    const response = await GET(request, context)
    const data = await response.json()

    expect(data).toEqual({ message: "Hello World" })
  })

  it("works with basic GET handler", async () => {
    type ResponseData = { message: string }

    const GET: Handler<ResponseData> = async () => {
      return NextResponse.json({ message: "Hello World" })
    }

    const request = createMockRequest()
    const context = createMockContext({})

    const response = await GET(request, context)
    const data = await response.json()

    expect(data).toEqual({ message: "Hello World" })
  })

  it("works with typed params", async () => {
    type ResponseData = { userId: string; name: string }
    type Params = { userId: string; name: string }

    const GET: Handler<ResponseData, Params> = async (_req, { params }) => {
      const { userId, name } = await params
      return NextResponse.json({ userId, name })
    }

    const request = createMockRequest()
    const context = createMockContext({ userId: "123", name: "John" })

    const response = await GET(request, context)
    const data = await response.json()

    expect(data).toEqual({ userId: "123", name: "John" })
  })

  it("handles POST requests with request body", async () => {
    type ResponseData = { created: boolean; data: unknown }

    const POST: Handler<ResponseData> = async (req) => {
      const body = await req.json()
      return NextResponse.json({ created: true, data: body })
    }

    const request = new NextRequest("http://localhost:3000/api/test", {
      method: "POST",
      body: JSON.stringify({ title: "Test Post" }),
      headers: { "Content-Type": "application/json" }
    })
    const context = createMockContext({})

    const response = await POST(request, context)
    const data = await response.json()

    expect(data).toEqual({ created: true, data: { title: "Test Post" } })
  })

  it("returns proper status codes", async () => {
    const DELETE: Handler<void, { id: string }> = async (_req, { params }) => {
      const { id } = await params
      if (!id) {
        return new NextResponse(null, { status: 400 })
      }
      return new NextResponse(null, { status: 204 })
    }

    const request = createMockRequest()
    const context = createMockContext({ id: "123" })

    const response = await DELETE(request, context)

    expect(response.status).toBe(204)
  })
})

describe("handler wrapper function", () => {
  it("wraps a handler function correctly", async () => {
    type ResponseData = { success: boolean }
    type Params = { id: string }

    const wrappedHandler = handler<ResponseData, Params>(
      async (_req, { params }) => {
        const { id } = await params
        return NextResponse.json({ success: !!id })
      }
    )

    const request = createMockRequest()
    const context = createMockContext({ id: "test-id" })

    const response = await wrappedHandler(request, context)
    const data = await response.json()

    expect(data).toEqual({ success: true })
  })

  it("maintains type safety", async () => {
    type User = { id: string; email: string }
    type Params = { userId: string }

    const getUserHandler = handler<User, Params>(async (_req, { params }) => {
      const { userId } = await params
      return NextResponse.json({
        id: userId,
        email: `user${userId}@example.com`
      })
    })

    const request = createMockRequest()
    const context = createMockContext({ userId: "42" })

    const response = await getUserHandler(request, context)
    const user = await response.json()

    expect(user).toEqual({
      id: "42",
      email: "user42@example.com"
    })
  })

  it("works with error responses", async () => {
    type ErrorResponse = { error: string }
    type Params = { id: string }

    const errorHandler = handler<ErrorResponse, Params>(
      async (_req, { params }) => {
        const { id } = await params
        if (!id || id === "invalid") {
          return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
        }
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
    )

    const request = createMockRequest()
    const context = createMockContext({ id: "invalid" })

    const response = await errorHandler(request, context)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: "Invalid ID" })
  })
})
