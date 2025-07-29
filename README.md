<h1 align="center">typed-route-handler</h1>

<div align="center">
  <strong>Type-safe Route Handlers for Next.js</strong>
</div>

```ts
import { NextResponse } from "next/server"
import type { Handler } from "typed-route-handler"

type ResponseData = {
  result: string
  over: number
}

export const GET: Handler<ResponseData> = async (req) => {
  return NextResponse.json({
    result: "this response is type-checked",
    over: 9000
  })
}
```

## Features

- ✅ **Type-safe** route handler responses
- ✅ **Type-safe** route handler parameters
- ✅ Full **zod (v3 and v4) and valibot compatibility**
- ✅ Production ready

## Installation

```sh
npm i typed-route-handler
```

> [!NOTE]
> This library may be installed as a devDependency when only used for types. If you'd like to use the [param parsers](#param-parsers) or the [route handler wrapper](#wrapper-function) function, you can install it as a regular dependency.

## Usage

The typed handler is easy to use: In the simplest case, just add the type `Handler` to your route handler and it will automatically assign types.

```diff
+ import type { Handler } from 'typed-route-handler'

- export const GET = async (req: NextRequest) => {
+ export const GET: Handler = async (req) => {
    // ...
  }
```

## Typed Responses

The real magic comes when you add typing to your responses.

```ts
import { NextResponse } from "next/server"
import type { Handler } from "typed-route-handler"

type ResponseData = {
  name: string
  age: number
}

export const GET: Handler<ResponseData> = (req) => {
  return NextResponse.json({
    name: "Bluey",
    age: "seven" // <-- this will cause a type error
  })
}
```

## Typed Parameters

We can also add type verification to our parameters:

```ts
// app/api/[name]/route.ts
import { NextResponse } from "next/server"
import { type Handler } from "typed-route-handler"

type ResponseData = {
  name: string
}

type Params = {
  name: string
}

export const GET: Handler<ResponseData, Params> = async (req, { params }) => {
  const { name } = await params // <-- this will mark `name` as a string

  return NextResponse.json({
    name
  })
}
```

## Param Parsers

Adding compile-time param checking is nice, but it does not perform any runtime type-checking which is more important for parameters. To do that, you can use the included [Standard Schema](https://standardschema.dev) `parseParams` method which works with `zod`, `valibot`, `arktype` and others:

```ts
import { NextResponse } from "next/server"
import { parseParams } from "typed-route-handler"
import * as z from "zod/v4"
import { type Handler } from "typed-route-handler"

type ResponseData = {
  id: number
  url: string
}

const paramsSchema = z.object({
  id: z.coerce.number(),
  url: z.string().url()
})

export const GET: Handler<ResponseData> = async (req, ctx) => {
  const { id, url } = await parseParams(ctx, paramsSchema)

  return NextResponse.json({
    id, // a number, coerced from a string
    url // a url
  })
}
```

You can also use the `safeParseParams` method to prevent throwing exceptions if the params are not valid.

## Wrapper function

In addition, the library also provides a convenience wrapper function `handler` which simply applies the Handler type to the function. Since this is a no-op, it is recommended to use the `Handler` type directly.

```ts
import { handler } from "typed-route-handler"
import { NextResponse } from "next/server"

type ResponseBody = {
  balance: number
}

export const GET = handler<ResponseBody>(async (req) => {
  return NextResponse.json({
    balance: 9_000
  })
})
```

### Usage with modified `req`s (e.g. next-auth)

When using this library with `next-auth` or other libraries which modify the `req` objects, you can pass a 3rd type to the `handler` call, representing modified Request object type. For example:

```ts
import { auth } from "@/auth"
import { type NextAuthRequest } from "next-auth"
import { handler } from "typed-route-handler"

type Params = { id: string }

export const GET = auth(
  handler<ResponseBody, Params, NextAuthRequest>((req, ctx) => {
    if (!req.auth?.user) {
      unauthorized()
    }

    // ...
  })
)
```

## 🏰 Production Ready

Already widely used in high-traffic production apps at [Catena Labs](https://catenalabs.com), [songbpm](https://songbpm.com), [jog.fm](https://jog.fm), [usdc.cool](https://usdc.cool), as well as all [StartKit](https://github.com/startkit-dev) next.js projects.

## Open Source

This project is MIT-licensed and is free to use and modify for your own projects.

It was created by [Matt Venables](https://venabl.es).
