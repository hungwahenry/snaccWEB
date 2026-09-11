"use client"

import { useMutation } from "@tanstack/react-query"
import { showError } from "@/lib/feedback"
import { muteChatRoom, unmuteChatRoom } from "../api"
import { restoreRooms, setRoomMuted } from "../cache"

/** The bell flips at once; a failure puts it back. */
export function useMuteChatRoom(roomId: string) {
  const { mutate } = useMutation({
    mutationFn: (muted: boolean) =>
      muted ? muteChatRoom(roomId) : unmuteChatRoom(roomId),
    onMutate: (muted) => ({ previous: setRoomMuted(roomId, muted) }),
    onError: (error, _muted, context) => {
      restoreRooms(context?.previous)
      showError(error)
    },
  })

  return mutate
}
