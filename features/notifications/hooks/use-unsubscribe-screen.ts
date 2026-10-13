"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { getErrorMessage } from "@/lib/api/errors"
import { describeUnsubscribe, unsubscribe } from "../api"

export function useUnsubscribeScreen(token: string) {
  const subject = useQuery({
    queryKey: ["email", "unsubscribe", token],
    queryFn: () => describeUnsubscribe(token),
    enabled: token.length > 0,
    retry: false,
  })
  const stop = useMutation({ mutationFn: () => unsubscribe(token) })

  return {
    loading: subject.isLoading,
    invalid: token.length === 0 || subject.isError,
    problem: subject.isError ? getErrorMessage(subject.error) : null,
    subject: subject.data ?? null,
    stopping: stop.isPending,
    stopped: stop.isSuccess,
    stop: () => stop.mutate(),
    error: stop.isError ? getErrorMessage(stop.error) : null,
  }
}
