import type { NextRequest, NextResponse } from "next/server"
import { type ZodIssue, z } from "zod"

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
 * The default value of the next.js route parameter
 */
export const nextRouteParamsSchema = z.record(
  z.union([z.string(), z.array(z.string())])
)
export type NextRouteParams = z.infer<typeof nextRouteParamsSchema>

/**
 * The Context parameter for route handlers, which is currently an optional
 * `params` object.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
 */
export interface NextRouteContext<U = NextRouteParams> {
  params?: U
}

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export type NextRouteHandler<
  T = void,
  U = NextRouteContext,
  V extends Request = NextRequest
> = (
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#request-optional
  request: V,
  // https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
  context: U
) => NextResponse<T> | Promise<NextResponse<T>>
