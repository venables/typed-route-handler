<h1 align="center">typed-route-handler</h1>

<div align="center">
  <strong>Type-safe Route Handlers for Next.js</strong>
</div>

```ts
type ResponseData = {
  result: string
  over: number
}

export const GET = handler<ResponseData>(async (req) => {
  return NextResponse.json({
    result: "this response is type-checked",
    over: 9000
  })
})
```

> [!NOTE]
> This library is designed for **Next.js 15 and higher**. To use this library with Next.js 14 or earlier, use typed-route-handler version `0.3.0`.

## Features

- ✅ **Type-safe** route handler responses
- ✅ **Type-safe** route handler parameters
- ✅ Full **zod compatibility**
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

We can also add type verification to our parameters. Each parameter `Context` extends from `NextRouteContext` which is a helper type mapping to: `{ params?: Record<string, string | string[]> }`.

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

## Usage with modified `req`s (e.g. next-auth)

When using this library with next-auth or other libraries which modify the `req` objects, you can pass a 3rd type to the `handler` call. You may also need to place `handler` within the other middleware because the other handlers may mask the return types, disabling the type-checking from `typed-route-handler` For example:

```ts
import { auth } from '@/auth'
import { type NextAuthRequest } from 'next-auth'
import { handler, type type NextRouteContext, unauthorized } from 'typed-route-handler'

export const GET = auth(
  handler<ResponseBody, NextRouteContext, NextAuthRequest>((req, ctx) => {
    if (!req.auth?.user) {
      unauthorized()
    }

    // ...
  })
)
```

## 🏰 Production Ready

Already widely used in high-traffic production apps in [songbpm](https://songbpm.com), [jog.fm](https://jog.fm), [usdc.cool](https://usdc.cool), as well as all [StartKit](https://github.com/startkit-dev/next) projects.

## ❤️ Open Source

This project is MIT-licensed and is free to use and modify for your own projects.

It was created by [Matt Venables](https://venabl.es).
