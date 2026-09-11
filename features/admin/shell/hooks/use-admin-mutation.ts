"use client"

import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query"
import { showSuccess } from "@/lib/feedback"

type Derived<T, TData, TVariables> =
  T | ((data: TData, variables: TVariables) => T)

function resolve<T, TData, TVariables>(
  value: Derived<T, TData, TVariables>,
  data: TData,
  variables: TVariables
): T {
  return typeof value === "function"
    ? (value as (data: TData, variables: TVariables) => T)(data, variables)
    : value
}

/**
 * Every admin write: says what happened, then refetches what it touched before the promise
 * settles, so a dialog that closes on success closes onto the new data rather than the old.
 * Callers get `run`, which resolves on success and rejects on failure after the toast.
 */
export function useAdminMutation<TVariables = void, TData = unknown>({
  mutationFn,
  success,
  invalidates = [],
  onSuccess,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>
  success: Derived<string, TData, TVariables>
  invalidates?: Derived<QueryKey[], TData, TVariables>
  onSuccess?: (data: TData, variables: TVariables) => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      showSuccess(resolve(success, data, variables))
      await Promise.all(
        resolve(invalidates, data, variables).map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      )
      onSuccess?.(data, variables)
    },
  })

  return { run: mutation.mutateAsync, pending: mutation.isPending }
}
