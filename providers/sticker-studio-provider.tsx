"use client"

import { createContext, useContext, type ReactNode } from "react"
import { toast } from "sonner"
import { useFlag } from "@/features/config/hooks/use-flag"
import { StickerCreator } from "@/features/stickers/components/sticker-creator"
import { useStickerCreator } from "@/features/stickers/hooks/use-sticker-creator"

export interface StickerSource {
  url: string
  width: number
  height: number
}

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

export function StickerStudioProvider({ children }: { children: ReactNode }) {
  const creator = useStickerCreator(() =>
    toast.success("Saved to your stickers.")
  )

  return (
    <StickerStudioContext.Provider value={creator.beginWith}>
      {children}
      <StickerCreator {...creator} />
    </StickerStudioContext.Provider>
  )
}
