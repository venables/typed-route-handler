import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { isApiError } from "./api-error"
import type { TypedRouteOnErrorCallback } from "./error-handler"
import { isNextJsError } from "./nextjs-error"

import type { ApiResponseError } from "../types"

export function buildErrorResponse(
  err: unknown,
  onError?: TypedRouteOnErrorCallback
): NextResponse<ApiResponseError> {
  /**
   * Let Next.js handle its own errors
   */
  if (isNextJsError(err)) {
    throw err
  }

  if (onError) {
    void onError(err)
  }

  /**
   * `ZodError` types occur when the request body is invalid, so we
   * treat these the same as a `ValidationError`
   */
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation Error",
        issues: err.issues
      },
      {
        status: 400
      }
    )
  }

  /**
   * If this is a known API error, such as from calling `unauthorized()` or
   * `validationError()`, handle it here.
   */
  if (isApiError(err)) {
    return NextResponse.json(
      {
        error: err.message
      },
      {
        status: err.status
      }
    )
  }

  /**
   * If we're unsure what error occurred, respond with a generic Internal
   * Server Error
   */
  // eslint-disable-next-line no-console -- we want to log this
  console.error("Unhandled API Error", err)
  return NextResponse.json(
    { error: "Internal server error" },
    {
      status: 500
    }
  )
}
