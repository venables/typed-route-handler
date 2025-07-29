import { describe, expect, it } from "bun:test"
import { NextRequest, NextResponse } from "next/server.js"
import * as v from "valibot"
import * as z from "zod/v4"
import { handler } from "./handler"
import { parseParams, safeParseParams } from "./parsers"

const createMockRequest = (url = "http://localhost:3000/api/test") => {
  return new NextRequest(url)
}

const createMockContext = <T>(params: T) => ({
  params: Promise.resolve(params)
})

describe("typed-route-handler integration", () => {
  describe("complete Next.js route examples", () => {
    it("simulates a user profile API route with Zod schema validation", async () => {
      interface User {
        id: number
        name: string
        email: string
        isActive: boolean
      }

      const paramsSchema = z.object({
        userId: z.string().transform(Number),
        format: z.enum(["json", "xml"]).optional().default("json")
      })

      const GET = handler<User>(async (_req, context) => {
        const { userId, format } = await parseParams(context, paramsSchema)

        // Simulate fetching user data
        const user: User = {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          isActive: true
        }

        if (format === "xml") {
          return new NextResponse(
            `<user><id>${user.id}</id><name>${user.name}</name></user>`,
            { headers: { "Content-Type": "application/xml" } }
          )
        }

        return NextResponse.json(user)
      })

      const request = createMockRequest("http://localhost:3000/api/users/123")
      const context = createMockContext({ userId: "123", format: "json" })

      const response = await GET(request, context)
      const data = await response.json()

      expect(data).toEqual({
        id: 123,
        name: "User 123",
        email: "user123@example.com",
        isActive: true
      })
    })

    it("simulates a blog post API route with Valibot schema validation", async () => {
      interface BlogPost {
        slug: string
        title: string
        content: string
        published: boolean
        tags: string[]
      }

      const paramsSchema = v.object({
        slug: v.pipe(v.string(), v.minLength(1)),
        draft: v.optional(
          v.pipe(
            v.string(),
            v.transform((val) => val === "true"),
            v.boolean()
          )
        )
      })

      const GET = handler<BlogPost>(async (_req, context) => {
        const { slug, draft = false } = await parseParams(context, paramsSchema)

        // Simulate fetching blog post
        const post: BlogPost = {
          slug,
          title: `Post about ${slug}`,
          content: `This is the content for ${slug}`,
          published: !draft,
          tags: ["typescript", "nextjs"]
        }

        return NextResponse.json(post)
      })

      const request = createMockRequest()
      const context = createMockContext({
        slug: "my-awesome-post",
        draft: "false"
      })

      const response = await GET(request, context)
      const data = await response.json()

      expect(data).toEqual({
        slug: "my-awesome-post",
        title: "Post about my-awesome-post",
        content: "This is the content for my-awesome-post",
        published: true,
        tags: ["typescript", "nextjs"]
      })
    })

    it("simulates a CRUD API with POST and validation", async () => {
      interface CreateResponse {
        id: string
        title: string
        categoryId: number
        createdAt: string
      }

      const paramsSchema = z.object({
        categoryId: z.string().transform(Number)
      })

      const bodySchema = z.object({
        title: z.string().min(1)
      })

      const POST = handler<CreateResponse>(async (req, context) => {
        const { categoryId } = await parseParams(context, paramsSchema)
        const rawBody = await req.json()
        const body = bodySchema.parse(rawBody)

        const response: CreateResponse = {
          id: "post-123",
          title: body.title,
          categoryId,
          createdAt: new Date().toISOString()
        }

        return NextResponse.json(response, { status: 201 })
      })

      const request = new NextRequest(
        "http://localhost:3000/api/categories/5/posts",
        {
          method: "POST",
          body: JSON.stringify({ title: "New Post" }),
          headers: { "Content-Type": "application/json" }
        }
      )
      const context = createMockContext({ categoryId: "5" })

      const response = await POST(request, context)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toMatchObject({
        categoryId: 5,
        title: "New Post",
        id: "post-123"
      })
    })
  })

  describe("error handling scenarios", () => {
    it("handles Zod validation errors gracefully", async () => {
      const paramsSchema = z.object({
        id: z.uuid(),
        page: z.coerce.number().min(1)
      })

      const GET = handler<
        | { ok: true; data: { id: string; page: number } }
        | { ok: false; error: string }
      >(async (_req, context) => {
        const result = await safeParseParams(context, paramsSchema)
        if (result.issues) {
          return NextResponse.json(
            {
              ok: false,
              error: "Invalid parameters"
            },
            { status: 400 }
          )
        }

        return NextResponse.json({ ok: true, data: result.value })
      })

      const request = createMockRequest()
      const context = createMockContext({ id: "not-a-uuid", page: "0" })

      const response = await GET(request, context)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toMatchObject({ ok: false, error: "Invalid parameters" })
    })

    it("handles Valibot validation errors gracefully", async () => {
      const paramsSchema = v.object({
        email: v.pipe(v.string(), v.email()),
        age: v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(18))
      })

      const POST = handler<
        | {
            error: string
            issues: { path: string | undefined; message: string }[]
          }
        | { message: string; email: string; age: number }
      >(async (_req, context) => {
        const result = await safeParseParams(context, paramsSchema)
        if (result.issues) {
          return NextResponse.json(
            {
              error: "Validation failed",
              issues: result.issues.map((issue) => ({
                path: issue.path
                  ?.map((p) => (typeof p === "object" ? p.key : p))
                  .join("."),
                message: issue.message
              }))
            },
            { status: 422 }
          )
        }

        return NextResponse.json({
          message: "Valid data",
          email: result.value.email,
          age: result.value.age
        })
      })

      const request = createMockRequest()
      const context = createMockContext({ email: "invalid-email", age: "16" })

      const response = await POST(request, context)
      const data = await response.json()

      expect(response.status).toBe(422)
      expect(data).toMatchObject({
        error: "Validation failed"
      })
    })

    it("demonstrates route protection with authentication", async () => {
      interface UserProfile {
        profile: string
      }

      interface AuthenticatedResponse {
        userId: number
        data: UserProfile
        authenticated: true
      }

      const paramsSchema = z.object({
        userId: z.string().transform(Number)
      })

      const GET = handler<AuthenticatedResponse | { error: string }>(
        async (req, context) => {
          // Simulate auth check
          const authHeader = req.headers.get("authorization")
          if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
          }

          const { userId } = await parseParams(context, paramsSchema)

          return NextResponse.json({
            userId,
            data: { profile: "user data" },
            authenticated: true
          })
        }
      )

      // Test without auth
      const requestNoAuth = createMockRequest()
      const context = createMockContext({ userId: "123" })

      const responseNoAuth = await GET(requestNoAuth, context)
      expect(responseNoAuth.status).toBe(401)

      // Test with auth
      const requestWithAuth = new NextRequest(
        "http://localhost:3000/api/test",
        {
          headers: { Authorization: "Bearer token123" }
        }
      )

      const responseWithAuth = await GET(requestWithAuth, context)
      const data = await responseWithAuth.json()

      expect(responseWithAuth.status).toBe(200)
      expect(data).toMatchObject({
        authenticated: true,
        userId: 123
      })
    })
  })

  describe("advanced type scenarios", () => {
    it("works with complex nested types and transformations", async () => {
      interface ProductFilter {
        categoryIds: number[]
        priceRange: { min: number; max: number }
        inStock: boolean
      }

      interface ProductSearchResponse {
        products: { id: number; name: string; price: number }[]
        filters: ProductFilter
        total: number
      }

      const paramsSchema = z.object({
        categories: z.string().transform((str) => str.split(",").map(Number)),
        minPrice: z.string().transform(Number),
        maxPrice: z.string().transform(Number),
        inStock: z.string().transform((val) => val === "true")
      })

      const GET = handler<ProductSearchResponse>(async (_req, context) => {
        const { categories, minPrice, maxPrice, inStock } = await parseParams(
          context,
          paramsSchema
        )

        const filters: ProductFilter = {
          categoryIds: categories,
          priceRange: { min: minPrice, max: maxPrice },
          inStock
        }

        return NextResponse.json({
          products: [
            { id: 1, name: "Product 1", price: 25 },
            { id: 2, name: "Product 2", price: 35 }
          ],
          filters,
          total: 2
        })
      })

      const request = createMockRequest()
      const context = createMockContext({
        categories: "1,2,3",
        minPrice: "10",
        maxPrice: "50",
        inStock: "true"
      })

      const response = await GET(request, context)
      const data = await response.json()

      expect(data).toMatchObject({
        filters: {
          categoryIds: [1, 2, 3],
          priceRange: { min: 10, max: 50 },
          inStock: true
        },
        total: 2
      })
    })
  })
})
