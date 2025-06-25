/**
 * The default value of the next.js route `params` object
 */
export type NextRouteParams = Record<string, string | string[] | undefined>

/**
 * The Context parameter for route handlers, which is currently a `params` promise.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
 */
export interface NextRouteContext<TParams = NextRouteParams> {
  params: Promise<TParams>
}
