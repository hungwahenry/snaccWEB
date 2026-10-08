"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { StickerCreator } from "@/features/stickers/components/sticker-creator"
import { useStickerCreator } from "@/features/stickers/hooks/use-sticker-creator"
import type { StickerSource } from "@/features/stickers/types"
import { showSuccess } from "@/lib/feedback"

const StickerStudioContext = createContext<
  ((source: StickerSource) => void) | null
>(null)

export function useStickerStudio():
  ((source: StickerSource) => void) | undefined {
  const enabled = useFlag("stickers")
  const createFrom = useContext(StickerStudioContext)

  if (!enabled || !createFrom) return undefined
  return createFrom
}

function stickerAdded() {
  showSuccess("Added to your Favourites.")
}

export function StickerStudioProvider({ children }: { children: ReactNode }) {
  const creator = useStickerCreator(stickerAdded)

  return (
    <StickerStudioContext.Provider value={creator.beginWith}>
      {children}
      <StickerCreator {...creator} />
    </StickerStudioContext.Provider>
  )
}
