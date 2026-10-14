"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { adminReportKeys } from "@/features/admin/reports/utils/keys"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  getRoom,
  listRoomMessages,
  listRooms,
  lockRoom,
  releaseRoomMessage,
  removeRoomMessage,
  unlockRoom,
} from "../api"
import type { RoomListQuery, RoomMessageQuery } from "../types"
import { adminRoomKeys } from "../utils/keys"

export function useRooms(query: RoomListQuery) {
  return useQuery({
    queryKey: adminRoomKeys.list(query),
    queryFn: () => listRooms(query),
    placeholderData: keepPreviousData,
  })
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: adminRoomKeys.detail(id),
    queryFn: () => getRoom(id),
  })
}

export function useRoomMessages(id: string, query: RoomMessageQuery) {
  return useQuery({
    queryKey: adminRoomKeys.messages(id, query),
    queryFn: () => listRoomMessages(id, query),
    placeholderData: keepPreviousData,
  })
}

export function useRoomActions() {
  const invalidates = [adminRoomKeys.all(), adminReportKeys.all()]

  const { run: lock } = useAdminMutation({
    mutationFn: (id: string) => lockRoom(id),
    success: "Room locked.",
    invalidates,
  })
  const { run: unlock } = useAdminMutation({
    mutationFn: (id: string) => unlockRoom(id),
    success: "Room open again.",
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      removeRoomMessage(id, reason),
    success: "Message removed.",
    invalidates,
  })
  const { run: release } = useAdminMutation({
    mutationFn: (id: string) => releaseRoomMessage(id),
    success: "Message back in the room.",
    invalidates,
  })

  return useMemo(
    () => ({
      lock,
      unlock,
      remove: (id: string, reason?: string) => remove({ id, reason }),
      release,
    }),
    [lock, unlock, remove, release]
  )
}
