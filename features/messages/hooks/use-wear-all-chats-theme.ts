"use client"

import { useMutation } from "@tanstack/react-query"
import type { ThemeChoice } from "@/features/chat-themes/utils/picker"
import type { PickedImage } from "@/lib/media"
import { wearAllChatsTheme, wearAllChatsThemePhoto } from "../api"
import { setAllChatsTheme } from "../cache"

export function useWearAllChatsTheme(onWorn: () => void) {
  return useMutation({
    mutationFn: ({ themeId, photo }: ThemeChoice<PickedImage>) =>
      themeId && photo
        ? wearAllChatsThemePhoto({ themeId, image: photo })
        : wearAllChatsTheme(themeId),
    onSuccess: (theme) => {
      setAllChatsTheme(theme)
      onWorn()
    },
  })
}
