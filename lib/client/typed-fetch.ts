import type { ApiResponseError } from "../types"

/**
 * Simple check to see if the response is an error. This method could be
 * expanded to check for other types of errors.
 *
 * This method adds a type hint to the `json` parameter, which is otherwise
 * unknown.
 */
function isError(
  response: Response,
  json?: unknown
): json is ApiResponseError | undefined {
  return !response.ok
}

/**
 *
 */
export async function typedFetch<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  })

  let json: unknown

  try {
    json = await response.json()
  } catch (_e) {
    throw new Error("Invalid JSON response")
  }

  if (isError(response, json)) {
    throw new Error(json?.error ?? response.statusText)
  }

  return json as T
}
