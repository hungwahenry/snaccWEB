"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getHangoutRoom } from "../api"
import { seedRoom } from "../cache"
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
      if (!open.isPending) open.mutate(snaccId)
    },
  }
}
