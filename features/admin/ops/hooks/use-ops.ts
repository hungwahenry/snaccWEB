"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  getDrift,
  getHealth,
  getQueues,
  reconcilePaystack,
  retryQueue,
  runTask,
} from "../api"
import { adminOpsKeys } from "../utils/keys"
import {
  reconcileMessage,
  REPAIR_TASKS,
  repairMessage,
  retryMessage,
} from "../utils/ops"

const LIVE_MS = 15_000

export function useHealth() {
  return useQuery({
    queryKey: adminOpsKeys.health(),
    queryFn: getHealth,
    refetchInterval: LIVE_MS,
  })
}

export function useQueues() {
  return useQuery({
    queryKey: adminOpsKeys.queues(),
    queryFn: getQueues,
    refetchInterval: LIVE_MS,
  })
}

export function useDrift() {
  return useQuery({ queryKey: adminOpsKeys.drift(), queryFn: getDrift })
}

export function useOpsActions() {
  const { run: repair } = useAdminMutation({
    mutationFn: async () => {
      const results = []
      for (const task of REPAIR_TASKS) results.push(await runTask(task))
      return results
    },
    success: repairMessage,
    invalidates: [adminOpsKeys.drift()],
  })
  const { run: reconcile } = useAdminMutation({
    mutationFn: () => reconcilePaystack(),
    success: reconcileMessage,
    invalidates: [adminOpsKeys.all()],
  })
  const { run: retry } = useAdminMutation({
    mutationFn: (queue: string) => retryQueue(queue),
    success: ({ retried }) => retryMessage(retried),
    invalidates: [adminOpsKeys.queues()],
  })

  return useMemo(
    () => ({ repair, reconcile, retry }),
    [repair, reconcile, retry]
  )
}
