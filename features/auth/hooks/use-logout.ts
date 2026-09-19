"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { wearAccentFor } from "@/features/appearance/utils/accent-store"
import { clearPendingChatMessages } from "@/features/chats/cache/pending-chat-messages"
import { clearPendingMessages } from "@/features/messages/cache/pending-messages"
import { clearPendingSnaccs } from "@/features/snaccs/cache/pending-snaccs"
import { voicePlayer } from "@/features/voice/hooks/use-voice-player"
import { LANDING_PATH } from "@/lib/routes"
import { signOut } from "../api"

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      clearPendingMessages()
      clearPendingChatMessages()
      clearPendingSnaccs()
      voicePlayer.stop()
      wearAccentFor(null)
      queryClient.clear()
      router.replace(LANDING_PATH)
    },
  })
}
