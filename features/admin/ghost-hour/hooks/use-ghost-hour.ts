"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { closeGhostHour, getGhostWindow, openGhostHour } from "../api"
import { openedMessage } from "../utils/ghost-hour"
import { adminGhostHourKeys } from "../utils/keys"

const LIVE_MS = 15_000

export function useGhostWindow() {
  return useQuery({
    queryKey: adminGhostHourKeys.window(),
    queryFn: getGhostWindow,
    refetchInterval: LIVE_MS,
  })
}

export function useGhostHourActions() {
  const invalidates = [adminGhostHourKeys.window()]

  const { run: open } = useAdminMutation({
    mutationFn: (minutes: number | undefined) => openGhostHour(minutes),
    success: openedMessage,
    invalidates,
  })
  const { run: close } = useAdminMutation({
    mutationFn: () => closeGhostHour(),
    success: "Ghost Hour closed.",
    invalidates,
  })

  return useMemo(() => ({ open, close }), [open, close])
}
