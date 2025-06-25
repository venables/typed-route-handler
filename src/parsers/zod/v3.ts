import type { NextRouteContext } from "../../next-types"
import type { z } from "zod/v3"

/**
 * Parses route parameters using a Zod v3 schema with strict validation.
 * Throws an error if validation fails.
 *
 * @param ctx - The Next.js route context containing the params
 * @param paramsSchema - The Zod schema to validate against
 * @returns A promise resolving to the parsed and validated parameters
 * @throws Will throw if validation fails
 *
 * @example
 * ```typescript
 * import { z } from "zod/v3"
 * import { parseParams } from "./parsers/zod/v3"
 *
 * const schema = z.object({
 *   id: z.string().uuid(),
 *   category: z.string().min(1)
 * })
 *
 * export async function GET(request: Request, ctx: NextRouteContext) {
 *   const params = await parseParams(ctx, schema)
 *   // params is now { id: string, category: string } with validation guaranteed
 *   return Response.json({ id: params.id, category: params.category })
 * }
 * ```
 */
export async function parseParams<T extends z.ZodTypeAny>(
  ctx: NextRouteContext,
  paramsSchema: T
): Promise<z.output<T>> {
  return paramsSchema.parse(await ctx.params)
}

/**
 * Safely parses route parameters using a Zod v3 schema without throwing errors.
 * Returns a result object with success/failure information.
 *
 * @param ctx - The Next.js route context containing the params
 * @param paramsSchema - The Zod schema to validate against
 * @returns A promise resolving to a SafeParseResult with success/failure status
 *
 * @example
 * ```typescript
 * import { z } from "zod/v3"
 * import { safeParseParams } from "./parsers/zod/v3"
 *
 * const schema = z.object({
 *   id: z.string().uuid(),
 *   page: z.string().transform(Number).optional()
 * })
 *
 * export async function GET(request: Request, ctx: NextRouteContext) {
 *   const result = await safeParseParams(ctx, schema)
 *   if (result.success) {
 *     // result.data is now { id: string, page?: number } with validation guaranteed
 *     return Response.json({ id: result.data.id, page: result.data.page })
 *   } else {
 *     return Response.json({ error: "Invalid parameters", issues: result.error.issues }, { status: 400 })
 *   }
 * }
 * ```
 */
export async function safeParseParams<T extends z.ZodTypeAny>(
  ctx: NextRouteContext,
  paramsSchema: T
) {
  return paramsSchema.safeParse(await ctx.params)
}
