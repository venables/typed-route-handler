import { type NextRequest, type NextResponse } from "next/server"
import { type ZodIssue, z } from "zod"

export type { NextResponse, NextRequest, ZodIssue }

/**
 * Schema for a zod error type
 */
export const zodIssueSchema = z
  .object({
    message: z.string(),
    path: z.array(z.string())
  })
  .transform((issue) => issue as ZodIssue)

/**
 * The API Error Response
 */
export const apiResponseErrorSchema = z.object({
  error: z.string(),
  issues: z.array(zodIssueSchema).optional()
})

export type ApiResponseError = z.infer<typeof apiResponseErrorSchema>

/**
 *
 */
export type ApiResponse<T> = T | ApiResponseError

/**
 *
 */
export interface NextRequestContext<T> {
  params: T
}

/**
 * The Context parameter for route handlers, which is currently an optional
 * `params` object.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
 */
export interface NextRouteContext<T = undefined> {
  params: T
}

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export type NextRouteHandler<T = void, U = NextRouteContext> = (
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#request-optional
  request: NextRequest,
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
  context: U
) => NextResponse<T> | Promise<NextResponse<T>>
