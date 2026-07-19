import { QueryClient } from "@tanstack/react-query"
import { isApiError } from "./api/errors"

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: (count, error) => {
          if (isApiError(error) && error.status < 500) return false
          return count < 2
        },
      },
      mutations: { retry: false },
    },
  })
}
