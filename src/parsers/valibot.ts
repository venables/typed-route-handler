import * as v from "valibot"
import type { NextRouteContext } from "../next-types"

/**
 * Parses route parameters using a Valibot schema with strict validation.
 * Throws an error if validation fails.
 *
 * @param ctx - The Next.js route context containing the params
 * @param paramsSchema - The Valibot schema to validate against
 * @returns A promise resolving to the parsed and validated parameters
 * @throws Will throw if validation fails
 *
 * @example
 * ```typescript
 * import * as v from "valibot"
 * import { parseParams } from "typed-route-handler/valibot"
 *
 * const schema = v.object({
 *   id: v.pipe(v.string(), v.uuid()),
 *   category: v.string()
 * })
 *
 * export async function GET(request: Request, ctx: NextRouteContext) {
 *   const params = await parseParams(ctx, schema)
 *   // params is now { id: string, category: string } with validation guaranteed
 *   return Response.json({ id: params.id, category: params.category })
 * }
 * ```
 */
export async function parseParams<T extends v.GenericSchema>(
  ctx: NextRouteContext,
  paramsSchema: T
): Promise<v.InferOutput<T>> {
  return v.parse(paramsSchema, await ctx.params)
}

/**
 * Safely parses route parameters using a Valibot schema without throwing errors.
 * Returns a result object with success/failure information.
 *
 * @param ctx - The Next.js route context containing the params
 * @param paramsSchema - The Valibot schema to validate against
 * @returns A promise resolving to a SafeParseResult with success/failure status
 *
 * @example
 * ```typescript
 * import * as v from "valibot"
 * import { safeParseParams } from "typed-route-handler/valibot"
 *
 * const schema = v.object({
 *   id: v.pipe(v.string(), v.uuid()),
 *   page: v.optional(v.pipe(v.string(), v.transform(Number), v.number()))
 * })
 *
 * export async function GET(request: Request, ctx: NextRouteContext) {
 *   const result = await safeParseParams(ctx, schema)
 *   if (result.success) {
 *     // result.output is now { id: string, page?: number } with validation guaranteed
 *     return Response.json({ id: result.output.id, page: result.output.page })
 *   } else {
 *     return Response.json({ error: "Invalid parameters", issues: result.issues }, { status: 400 })
 *   }
 * }
 * ```
 */
export async function safeParseParams<T extends v.GenericSchema>(
  ctx: NextRouteContext,
  paramsSchema: T
) {
  return v.safeParse(paramsSchema, await ctx.params)
}
