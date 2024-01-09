/* eslint-disable no-console -- this is a logger */
import type { NextRequest } from "../types"

export function logRequest(request: NextRequest): void
export function logRequest(
  request: NextRequest,
  response: Response,
  responseTime: number
): void
export function logRequest(
  request: NextRequest,
  response?: Response,
  responseTime?: number
) {
  const method = request.method
  const url = request.nextUrl.pathname

  if (response?.ok) {
    console.log(
      ` ✓ [${method}] ${url} (${response.status}) took ${responseTime}ms`
    )
  } else if (response) {
    console.log(
      ` × [${method}] ${url} (${response.status}) took ${responseTime}ms`
    )
  } else {
    /**
     * Log the HTTP request
     */
    console.log(` → [${method}] ${url}`)
  }
}
