"use client"

import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { isNotFound } from "@/lib/api/errors"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { hangoutTitle } from "../../utils/hangouts"

export type HangoutPageState = "off" | "missing" | "failed" | "ready"

export function useHangoutPage(snaccId: string) {
  const enabled = useFlagWhenKnown("hangouts")
  useRealtimeRoom(enabled ? realtimeRooms.snacc(snaccId) : null)
  const query = useSnacc(snaccId)

  const snacc = query.data ?? null
  const hangout = snacc?.hangout ?? null
  const missing = query.isError
    ? isNotFound(query.error)
    : snacc !== null && !hangout
  const state: HangoutPageState =
    enabled === false
      ? "off"
      : missing
        ? "missing"
        : query.isError
          ? "failed"
          : "ready"

  return {
    state,
    loading: enabled === null || !hangout,
    snacc,
    hangout,
    title: hangout ? hangoutTitle(hangout) : "Hangout",
    retry: () => void query.refetch(),
  }
}
