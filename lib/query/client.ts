import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { authKeys } from "@/features/auth/utils/keys"
import { configKeys } from "@/features/config/utils/keys"
import { holdPath } from "@/features/navigation/utils/gate"
import { MINUTE_MS } from "@/lib/duration"
import { isApiError, isUnauthenticated } from "../api/errors"
import { showError } from "../feedback"

declare module "@tanstack/react-query" {
  interface Register {
    /** `silent` is for a mutation whose caller shows its own error, inline or otherwise. */
    mutationMeta: { silent?: boolean }
  }
}

function refetchFlagsWhenOff(client: QueryClient, error: unknown): void {
  if (!isApiError(error) || error.code !== "feature_disabled") return

  void client.invalidateQueries(
    { queryKey: configKeys.app() },
    { cancelRefetch: false }
  )
}

function recheckSession(client: QueryClient, error: unknown): void {
  if (!isApiError(error)) return
  if (!isUnauthenticated(error) && !holdPath(error.code)) return

  void client.invalidateQueries(
    { queryKey: authKeys.me() },
    { cancelRefetch: false }
  )
}

export function makeQueryClient() {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        refetchFlagsWhenOff(client, error)
        recheckSession(client, error)
      },
    }),
    mutationCache: new MutationCache({
      // A mutation with its own onError owns its feedback, so it is left to say it once.
      onError: (error, _variables, _context, mutation) => {
        refetchFlagsWhenOff(client, error)
        recheckSession(client, error)
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

  return client
}

let browserClient: QueryClient | undefined

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return makeQueryClient()
  browserClient ??= makeQueryClient()
  return browserClient
}
