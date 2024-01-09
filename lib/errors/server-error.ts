import { ApiError } from "./api-error"

/**
 * HTTP 500 Internal Server Error
 */
export class ServerError extends ApiError {
  status = 500

  constructor(message?: string, ...args: never[]) {
    super(message ?? "Internal Server Error", ...args)
  }
}

export function serverError(message?: string): never {
  throw new ServerError(message)
}
