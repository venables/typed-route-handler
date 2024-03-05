import { type NextRequest, type NextResponse } from "next/server"

import { logRequest } from "./logger"
import { buildErrorResponse } from "../errors/error-response"
import {
  type ApiResponse,
  type NextRouteContext,
  type NextRouteHandler
} from "../types"

/**
 * Wrap an API handler with additional logging, error handling, etc.
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
  routeHandler: NextRouteHandler<ApiResponse<T>, U, V>
): NextRouteHandler<ApiResponse<T>, U, V> => {
  return async (request, context) => {
    const startTime = new Date()

    /**
     * Log the HTTP request
     */
    logRequest(request)

    let response: NextResponse<ApiResponse<T>>

    try {
      response = await routeHandler(request, context)
    } catch (err) {
      response = buildErrorResponse(err)
    }

    /**
     * Log the HTTP response status & timing
     */
    logRequest(request, response, new Date().getTime() - startTime.getTime())

    return response
  }
}
