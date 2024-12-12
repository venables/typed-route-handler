<h1 align="center">typed-route-handler</h1>

<div align="center">
  <strong>Type-safe Route Handlers for Next.js</strong>
</div>

```ts
import type { Handler } from 'typed-route-handler'

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

> [!NOTE]
> This library is designed for **Next.js 15 and higher**. To use this library with Next.js 14 or earlier, use typed-route-handler version `0.3.0`.

## Features

- ✅ **Type-safe** route handler responses
- ✅ **Type-safe** route handler parameters
- ✅ Full **zod compatibility**
- ✅ Production ready

## Installation

```sh
npm i -D typed-route-handler
```

This library can be installed as a devDependency when only used for types. If you'd like to use the [wrapper](#wrapper) function, you can install it as a regular dependency.

## Usage

Typed handler is easy to use: In the simplest case, just add the type `Handler` to your route handler and you're good to go!

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
import { NextResponse } from "next"
import type { Handler } from 'typed-route-handler'

type ResponseData = {
  name: string
  age: number
}

export const GET: Handler<ResponseData> = (req) => {
  return NextResponse.json({
    name: "Bluey",
    age: "seven", // <-- this will cause a type error
  })
}
```

## Typed Parameters

We can also add type verification to our parameters. Each parameter `Context` extends from `NextRouteContext`.  

```ts
// app/api/[name]/route.ts
import { NextResponse } from "next/server"
import { type Handler, type NextRouteContext } from "typed-route-handler"

type ResponseData = {
  name: string
}

type Context = NextRouteContext<{
  name: string
}>

export const GET: Handler<ResponseData, Context> = async (req, context) => {
  const { name } = await context.params // <-- this will be type-safe

  return NextResponse.json({
    name
  })
}
```

Note that this does not perform any runtime type-checking. To do that, you can use the zod types:

```ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { type Handler } from "typed-route-handler"

type ResponseData = {
  name: string
}

const contextSchema = z.object({
  params: z.promise( // <-- note the promise here, for next.js 15+
    z.object({
      name: z.string()
    })
  )
})

export const GET: Handler<ResponseData, z.infer<typeof contextSchema>> = async (req, context) => {
  const { name } = await context.params // <-- this will still be type-safe

  // or you can parse the schema:
  const { params } = contextSchema.parse(context)
  const { name } = await params


  return NextResponse.json({
    name
  })
}
```

## Wrapper function

In addition to providing these types, the library also provides a convenience wrapper function `handler` which simply applies the Handler type to the function. Since this is a no-op, it is recommended to use the `Handler` type directly.

NOTE: If you use this method, you should install this package as a `dependency`

```ts
import { handler } from "typed-route-handler"
import { NextResponse } from 'next/server'

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
import { auth } from '@/auth'
import { type NextAuthRequest } from 'next-auth'
import { handler, type type NextRouteContext } from 'typed-route-handler'

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
