"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { getDrift, getHealth, getQueues, retryQueue, runTask } from "./api"

const KEY = ["admin", "ops"]

export function useHealth() {
  return useQuery({ queryKey: [...KEY, "health"], queryFn: getHealth, refetchInterval: 15_000 })
}

export function useQueues() {
  return useQuery({ queryKey: [...KEY, "queues"], queryFn: getQueues, refetchInterval: 15_000 })
}

export function useDrift() {
  return useQuery({ queryKey: [...KEY, "drift"], queryFn: getDrift })
}

export function useOpsMutations() {
  const qc = useQueryClient()
  const onError = (error: unknown) => toast.error(getErrorMessage(error))
  return {
    reconcile: useMutation({
      mutationFn: async () => {
        await runTask("reconcile-counters")
        await runTask("reconcile-scores")
        await runTask("reconcile-wallets")
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: KEY })
        toast.success("Reconcile complete — all counters back in sync.")
      },
      onError,
    }),
    retry: useMutation({
      mutationFn: retryQueue,
      onSuccess: (result) => {
        qc.invalidateQueries({ queryKey: [...KEY, "queues"] })
        toast.success(`Retried ${result.retried} failed job(s).`)
      },
      onError,
    }),
  }
}
