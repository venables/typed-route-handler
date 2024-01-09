<h1 align="center">typed-route-handler</h1>

<div align="center">
  <strong>Type-safe Route Handlers for Next.js</strong>
</div>

## Features

- ✅ **Type-safe** route handler responses
- ✅ **Type-safe** route handler parameters
- ✅ Extended Next.js **error handling**
- ✅ Full **zod compatibility**
- ✅ Route handler **timing**
- ✅ Request **logging**
- ✅ Production ready

## Installation

```sh
npm i typed-route-handler
```

## Usage

Typed handler is easy to use: In the simplest case, just wrap your Route Handler with `handler` and you're good to go!

```diff
+ import { handler } from 'typed-route-handler'

- export const GET = async (req: NextRequest) => {
+ export const GET = handler(async (req) => {
    // ...
- }
+ })
```

## Typed Responses

The real magic comes when you add typing to your responses.

```ts
import { NextResponse } from "next"

type ResponseData = {
  name: string
  age: number
}

export const GET = handler<ResponseData>((req) => {
  // ...

  return NextResponse.json({
    name: "Bluey",
    age: 7,
    something: "else" // <-- this will cause a type error
  })
})
```

## Typed Parameters

We can also add type verification to our parameters.

```ts
import { NextResponse } from "next"

type ResponseData = {
  name: string
}

type Context = {
  params: {
    userId: string
  }
}

export const GET = handler<ResponseData, Context>((req, context) => {
  // ...
  const userId = context.params.userId // <-- this will be type-safe

  return NextResponse.json({
    name: "Bluey"
  })
})
```

This can get even more powerful with `zod`

```ts
import { NextResponse } from "next"
import { z } from "zod"

type ResponseData = {
  name: string
}

const contextSchema = z.object({
  params: z.object({
    id: z.string()
  })
})

export const GET = handler<ResponseData, z.infer<typeof contextSchema>>(
  (req, context) => {
    // ...
    const userId = context.params.userId // <-- this will still be type-safe

    // or you can parse the schema:
    const { params } = contextSchema.parse(context)

    return NextResponse.json({
      name: "Bluey"
    })
  }
)
```

## Typed request bodies

Similarly, you can use `zod` to parse request bodies:

```ts
import { NextResponse } from "next"
import { z } from "zod"

type ResponseData = {
  name: string
}

const bodySchema = z.object({
  username: z.string()
})

export const PUT = handler<ResponseData>((req, context) => {
  const body = bodySchema.parse(await req.json())

  // If the body does not satisfy `bodySchema`, the route handler will catch
  // the error and return a 400 error with the error details.

  return NextResponse.json({
    name: body.username
  })
})
```

## Automatic `zod` issue handling

When a zod error is thrown in the handler, it will be caught automatically and
converted to a Validation Error with a 400 status code.

Example:

```json
{
  "error": "Validation Error",
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

## Extended Next.js errors

This library adds the following convenience methods to Route Handlers.

Similar to how Next.js offers `notFound()` and `redirect()`, typed-route-handler offers:

- `unauthorized()`
- `validationError()`

For example:

```ts
export const GET = handler(async (req) => {
  const session = await auth()

  if (!session) {
    unauthorized()
  }
})
```

This will return the following HTTP 401 Unauthorized body:

```json
{
  "error": "Unauthorized"
}
```

## Client-side Usage

`typed-route-handler` comes with a client library that extends the traditional `fetch` API with type information.

The `typedFetch` function will automatically parse the response as JSON, and apply the proper types. On an error response, it will throw.

```ts
import { typedFetch } from "typed-route-handler/client"

const data = await typedFetch<{ id: number; username: string }>("/api/user")

data.id // <-- number
data.username // <-- string
```

If there's an API error, it will be thrown by the client:

```ts
import { typedFetch } from "typed-route-handler/client"

try {
  await typedFetch("/api/user")
} catch (e) {
  e.message // <-- Validation Error, etc
}
```

## Roadmap

- [ ] Add support for streaming responses (generic `Response` type)
- [ ] Add support for custom API response formats
- [ ] Client-side error handling with zod issues

## 🏰 Production Ready

Already widely used in high-traffic production apps in [songbpm](https://songbpm.com), [jog.fm](https://jog.fm), [usdc.cool](https://usdc.cool), as well as all [StartKit](https://github.com/startkit-dev/startkit) projects.

## ❤️ Open Source

This project is MIT-licensed and is free to use and modify for your own projects.

It was created by [Matt Venables](https://venabl.es).
