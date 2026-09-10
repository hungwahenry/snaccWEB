"use client"

import { getErrorMessage } from "@/lib/api/errors"
import { getQueryClient } from "@/lib/query-client"
import { newId } from "@/lib/ids"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useMe } from "@/features/auth/hooks/use-me"
import {
  deleteChatMessage,
  markChatRoomRead,
  sendChatMessage,
  setChatRoomMuted,
} from "../api"
import { replaceChatMessage, upsertChatMessage } from "../cache"
import { CHAT_ROOMS_KEY } from "../keys"
import type { ChatMessage } from "../types"
import { useChatMessages } from "./use-chat-messages"
import { useChatRooms } from "./use-chat-rooms"

export function useChatRoomScreen(roomId: string) {
  const me = useMe()
  const rooms = useChatRooms()
  const room = rooms.data?.find((each) => each.id === roomId) ?? null
  const { messages, loading, loadMore } = useChatMessages(roomId)
  const [draft, setDraft] = useState("")

  const refreshRooms = () =>
    getQueryClient().invalidateQueries({ queryKey: CHAT_ROOMS_KEY })

  // Opening the room is the read; anything after is counted again on the next open.
  useEffect(() => {
    if (!roomId) return
    void markChatRoomRead(roomId).then(refreshRooms).catch(() => undefined)
  }, [roomId])

  const send = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (message, input) =>
      replaceChatMessage(roomId, { ...message, id: input.id }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const mute = useMutation({
    mutationFn: (muted: boolean) => setChatRoomMuted(roomId, muted),
    onSuccess: refreshRooms,
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const removal = useMutation({
    mutationFn: deleteChatMessage,
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  function post() {
    const body = draft.trim()
    const user = me.data
    const profile = user?.profile
    if (!body || !user || !profile) return

    const id = newId()
    const optimistic: ChatMessage = {
      id,
      room_id: roomId,
      body,
      created_at: new Date().toISOString(),
      mine: true,
      deleted: false,
      deleted_by_sender: false,
      held: false,
      sender: {
        id: user.id,
        username: profile.username ?? null,
        display_name: profile.display_name ?? null,
        avatar_url: profile.avatar_url ?? "",
        official: false,
      },
      images: [],
      reply_to: null,
    }

    upsertChatMessage(roomId, optimistic)
    setDraft("")
    send.mutate({ id, roomId, body })
  }

  return {
    room,
    messages,
    loading,
    loadMore,
    draft,
    setDraft,
    canSend: draft.trim().length > 0 && !send.isPending,
    post,
    toggleMuted: () => mute.mutate(!room?.muted),
    remove: (id: string) => removal.mutate(id),
  }
}
