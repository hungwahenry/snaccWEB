import { QueryClient } from "@tanstack/react-query"
import { isApiError } from "./api/errors"
import { MINUTE_MS } from "@/lib/duration"

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: MINUTE_MS,
        retry: (count, error) => {
          if (isApiError(error) && error.status > 0 && error.status < 500)
            return false
          return count < 2
        },
      },
      mutations: { retry: false },
    },
  })
}

let browserClient: QueryClient | undefined

/// One client per browser tab, so cache helpers outside React can reach the same cache the
/// hooks read from. On the server every request gets its own.
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return makeQueryClient()
  browserClient ??= makeQueryClient()
  return browserClient
}
