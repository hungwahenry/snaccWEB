import { MutationCache, QueryClient } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { isApiError } from "../api/errors"
import { showError } from "../feedback"

declare module "@tanstack/react-query" {
  interface Register {
    /** `silent` is for a mutation whose caller shows its own error, inline or otherwise. */
    mutationMeta: { silent?: boolean }
  }
}

export function makeQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      // A mutation with its own onError owns its feedback, so it is left to say it once.
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silent || mutation.options.onError) return
        showError(error)
      },
    }),
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

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return makeQueryClient()
  browserClient ??= makeQueryClient()
  return browserClient
}
