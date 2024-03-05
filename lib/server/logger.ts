/* eslint-disable no-console -- this is a logger */
import type { NextRequest } from "next/server"

function isNextRequest(request: Request): request is NextRequest {
  return "nextUrl" in request
}

export function logRequest<V extends Request>(request: V): void
export function logRequest<V extends Request>(
  request: V,
  response: Response,
  responseTime: number
): void
export function logRequest<V extends Request>(
  request: V,
  response?: Response,
  responseTime?: number
) {
  const method = request.method
  const url = isNextRequest(request) ? request.nextUrl.pathname : request.url

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
