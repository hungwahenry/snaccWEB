import { QueryClient } from "@tanstack/react-query"
import { isApiError } from "./api/errors"
import { MINUTE_MS } from "@/lib/duration"

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: MINUTE_MS,
        retry: (count, error) => {
          if (isApiError(error) && error.status < 500) return false
          return count < 2
        },
      },
      mutations: { retry: false },
    },
  })
}
