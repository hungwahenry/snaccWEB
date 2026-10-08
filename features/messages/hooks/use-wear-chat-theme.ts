"use client"

import { useMutation } from "@tanstack/react-query"
import type { ThemeChoice } from "@/features/chat-themes/utils/picker"
import type { PickedImage } from "@/lib/media"
import { wearChatTheme, wearChatThemePhoto } from "../api"
import { setConversation } from "../cache"

export function useWearChatTheme(conversationId: string, onWorn: () => void) {
  return useMutation({
    mutationFn: ({ themeId, photo }: ThemeChoice<PickedImage>) =>
      themeId && photo
        ? wearChatThemePhoto(conversationId, { themeId, image: photo })
        : wearChatTheme(conversationId, themeId),
    onSuccess: (conversation) => {
      setConversation(conversation)
      onWorn()
    },
  })
}
