"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useChatThemes } from "@/features/chat-themes/hooks/use-chat-themes"
import { useColorMode } from "@/features/chat-themes/hooks/use-color-mode"
import type { ChatTheme } from "@/features/chat-themes/types"
import { paintOf } from "@/features/chat-themes/utils/paint"
import {
  choiceFor,
  pickerState,
  type ThemeChoice,
} from "@/features/chat-themes/utils/picker"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { useBack } from "@/hooks/use-back"
import { pickImages, type PickedImage } from "@/lib/media"
import { conversationDetailsPath } from "../routes"
import { useConversation } from "./use-conversation"
import { useWearChatTheme } from "./use-wear-chat-theme"

export function useChatThemeScreen(id: string) {
  const router = useRouter()
  const back = useBack(conversationDetailsPath(id))
  const enabled = useFlag("chat_themes")
  const query = useConversation(id)
  const catalog = useChatThemes()
  const premiumOnSale = useFlag("premium")
  const premium = useIsPremium()
  const mode = useColorMode()
  const wear = useWearChatTheme(id, back)
  const [picked, setPicked] = useState<ThemeChoice<PickedImage> | null>(null)

  const conversation = query.data ?? null
  const state = pickerState({
    catalog: catalog.data ?? [],
    worn: conversation?.theme ?? null,
    picked,
    premium,
    premiumOnSale,
  })
  const failed = catalog.isError || query.isError

  async function pickPhotoFor(theme: ChatTheme) {
    const [photo] = await pickImages(1)
    if (photo) setPicked({ themeId: theme.id, photo })
  }

  function select(theme: ChatTheme | null) {
    if (theme?.kind === "photo" && !state.photoUrl) {
      void pickPhotoFor(theme)
      return
    }
    setPicked(choiceFor(theme, picked))
  }

  const option = (theme: ChatTheme) => ({
    key: theme.id,
    label: theme.label,
    paint: paintOf(theme.look, mode),
    photoUrl: theme.kind === "photo" ? state.photoUrl : null,
    needsPhoto: theme.kind === "photo" && !state.photoUrl,
    selected: theme.id === state.selectedId,
    locked: theme.premium && !premium,
    onPress: () => select(theme),
  })
  const photoThemes = state.themes.filter((theme) => theme.kind === "photo")

  return {
    onBack: back,
    unavailable: !enabled,
    failed,
    loading: !failed && (catalog.isPending || !conversation),
    retry: () => {
      void catalog.refetch()
      void query.refetch()
    },
    preview: {
      paint: state.selected ? paintOf(state.selected.look, mode) : null,
      photoUrl: state.selected?.kind === "photo" ? state.photoUrl : null,
    },
    presets: [
      {
        key: "default",
        label: "Default",
        paint: null,
        photoUrl: null,
        needsPhoto: false,
        selected: state.selectedId === null,
        locked: false,
        onPress: () => select(null),
      },
      ...state.themes.filter((theme) => theme.kind === "preset").map(option),
    ],
    photo:
      photoThemes.length > 0
        ? {
            options: photoThemes.map(option),
            chooseLabel: state.photoUrl
              ? "Choose another photo"
              : "Choose a photo",
            onChoose: () =>
              void pickPhotoFor(
                state.selected?.kind === "photo"
                  ? state.selected
                  : photoThemes[0]
              ),
          }
        : null,
    apply: {
      label: state.locked ? "Get Premium" : "Use theme",
      disabled: !state.locked && !state.changed,
      busy: wear.isPending,
      onPress: () => {
        if (state.locked) router.push(PREMIUM_PATH)
        else if (picked) wear.mutate(picked)
      },
    },
  }
}
