"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useChatThemes } from "@/features/chat-themes/hooks/use-chat-themes"
import { useColorMode } from "@/features/chat-themes/hooks/use-color-mode"
import type { ChatTheme, WornTheme } from "@/features/chat-themes/types"
import { paintOf } from "@/features/chat-themes/utils/paint"
import {
  choiceFor,
  pickerState,
  pictureFor,
  type ThemeChoice,
} from "@/features/chat-themes/utils/picker"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { pickImages, type PickedImage } from "@/lib/media"

export interface ThemeFallback {
  label: string
  theme: WornTheme | null
}

export const APP_LOOK: ThemeFallback = { label: "Default", theme: null }

export interface ThemePickerSource {
  worn: WornTheme | null
  ready: boolean
  failed: boolean
  retry: () => void
  fallback: ThemeFallback
  onBack: () => void
  wear: {
    mutate: (choice: ThemeChoice<PickedImage>) => void
    isPending: boolean
  }
}

export type ThemePickerScreen = ReturnType<typeof useThemePicker>

export function useThemePicker({
  worn,
  ready,
  failed,
  retry,
  fallback,
  onBack,
  wear,
}: ThemePickerSource) {
  const router = useRouter()
  const enabled = useFlag("chat_themes")
  const catalog = useChatThemes()
  const premiumOnSale = useFlag("premium")
  const premium = useIsPremium()
  const mode = useColorMode()
  const [picked, setPicked] = useState<ThemeChoice<PickedImage> | null>(null)

  const state = pickerState({
    catalog: catalog.data ?? [],
    worn,
    picked,
    premium,
    premiumOnSale,
  })
  const broken = catalog.isError || failed

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

  const fallbackLook = fallback.theme
    ? {
        paint: paintOf(fallback.theme.look, mode),
        photoUrl: pictureFor(fallback.theme, fallback.theme.photo_url),
      }
    : { paint: null, photoUrl: null }

  const option = (theme: ChatTheme) => ({
    key: theme.id,
    label: theme.label,
    paint: paintOf(theme.look, mode),
    photoUrl: pictureFor(theme, state.photoUrl),
    needsPhoto: theme.kind === "photo" && !state.photoUrl,
    selected: theme.id === state.selectedId,
    locked: theme.premium && !premium,
    onPress: () => select(theme),
  })
  const photoThemes = state.themes.filter((theme) => theme.kind === "photo")

  return {
    onBack,
    unavailable: !enabled,
    failed: broken,
    loading: !broken && (catalog.isPending || !ready),
    retry: () => {
      void catalog.refetch()
      retry()
    },
    preview: state.selected
      ? {
          paint: paintOf(state.selected.look, mode),
          photoUrl: pictureFor(state.selected, state.photoUrl),
        }
      : fallbackLook,
    presets: [
      {
        key: "default",
        label: fallback.label,
        ...fallbackLook,
        needsPhoto: false,
        selected: state.selectedId === null,
        locked: false,
        onPress: () => select(null),
      },
      ...state.themes.filter((theme) => theme.kind !== "photo").map(option),
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
