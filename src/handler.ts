import type { NextRequest, NextResponse } from "next/server.js"
import type { NextRouteContext, NextRouteParams } from "./next-types"

/**
 * A typed Route Handler
 *
 * @example
 * ```ts
 *   type ResponseData = { name: string }
 *   type Params = { userId: string, name: string }
 *
 *   export const GET: Handler<ResponseData, Params> = async (req, { params }) => {
 *      const { userId, name } = await params
 *      if (!userId) {
 *        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 *      }
 *
 *      return NextResponse.json({ name })
 *   }
 * ```
 *
 * https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export type Handler<
  TResponse = void,
  TParams = NextRouteParams,
  TRequest extends Request = NextRequest
> = (
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#request-optional
  request: TRequest,
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
  context: NextRouteContext<TParams>
) => NextResponse<TResponse> | Promise<NextResponse<TResponse>>

/**
 * Wrap an API handler for types
 *
 * @example
 * ```ts
 *   type ResponseData = { name: string }
 *   type Params = { id: string }
 *
 *   export const GET = handler<ResponseData, Params>(async (req, { params }) => {
 *      const { id } = await params
 *
 *      if (!id) {
 *        return NextResponse.json({ error: "Not found" }, { status: 404 })
 *      }
 *
 *      return NextResponse.json({ name: "Example" })
 *   })
 * ```
 *
 * @param handler - the api handler
 * @returns a wrapped api handler
 */
export const handler = <
  TResponse = void,
  TParams = NextRouteParams,
  TRequest extends Request = NextRequest
>(
  routeHandler: Handler<TResponse, TParams, TRequest>
): Handler<TResponse, TParams, TRequest> => {
  return routeHandler
}
