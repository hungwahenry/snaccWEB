"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getHangoutRoom } from "../api"
import { findHangoutRoom, seedRoom } from "../cache"
import { chatRoomPath } from "../routes"

export function useOpenHangoutChat() {
  const router = useRouter()
  const open = useMutation({
    mutationFn: getHangoutRoom,
    onSuccess: (room) => {
      seedRoom(room)
      router.push(chatRoomPath(room.id))
    },
  })

  return {
    pending: open.isPending,
    open: (snaccId: string) => {
      const known = findHangoutRoom(snaccId)
      if (known) router.push(chatRoomPath(known.id))
      else if (!open.isPending) open.mutate(snaccId)
    },
  }
}
