import type { NextRequest, NextResponse } from "next/server.js"

/**
 * The default value of the next.js route parameter
 */
type NextRouteParams = Record<string, string | string[] | undefined>

/**
 * The Context parameter for route handlers, which is currently a `params` promise.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
 */
export interface NextRouteContext<U = NextRouteParams> {
  params: Promise<U>
}

/**
 * A typed Route Handler
 *
 * @example
 * ```ts
 *   type ResponseData = { name: string }
 *   type Context = NextRouteContext<{ userId: string, name: string }>
 *
 *   export const GET: Handler<ResponseData, Context> = (req, context) => {
 *      const { userId, name } = await context.params
 *      if (!userId) {
 *        unauthorized()
 *      }
 *
 *      return NextResponse.json({ name })
 *   }
 * ```
 *
 * https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export type Handler<
  T = void,
  U = NextRouteContext,
  V extends Request = NextRequest
> = (
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#request-optional
  request: V,
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
  context: U
) => NextResponse<T> | Promise<NextResponse<T>>

/**
 * Wrap an API handler for types
 *
 * @example
 * ```ts
 *   type ResponseData = { name: string }
 *   type Context = NextRouteContext<{ id: string }>
 *
 *   export const GET = handler<ResponseData, Context>((req, context) => {
 *      const { id } = await context.params
 *      if (!id) {
 *        unauthorized()
 *      }
 *
 *      return NextResponse.json({ name: request.query.name })
 *   })
 * ```
 *
 * @param handler - the api handler
 * @returns a wrapped api handler
 */
export const handler = <
  T = void,
  U = NextRouteContext,
  V extends Request = NextRequest
>(
  routeHandler: Handler<T, U, V>
): Handler<T, U, V> => {
  return routeHandler
}
