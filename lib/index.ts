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
interface NextRouteContext<U = NextRouteParams> {
  params: Promise<U>
}

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
type NextRouteHandler<
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
 *      if (!context.params.userId) {
 *        unauthorized()
 *      }
 *
 *      if (!req.query.name) {
 *        validationError("name is required")
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
  routeHandler: NextRouteHandler<T, U, V>
): NextRouteHandler<T, U, V> => {
  return routeHandler
}
