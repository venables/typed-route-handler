import { ApiError } from "./api-error"

/**
 * HTTP 401 Unauthorized
 */
export class ForbiddenError extends ApiError {
  status = 403

  constructor(message?: string, ...args: never[]) {
    super(message ?? "Forbidden", ...args)
  }
}

export function forbidden(message?: string): never {
  throw new ForbiddenError(message)
}
