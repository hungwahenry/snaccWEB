"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  listHeldStickers,
  releaseSticker,
  removeSticker,
  takeDownStickerPack,
} from "../api"
import type { HeldListQuery } from "../types"
import { adminStickerKeys } from "../utils/keys"

export function useHeldStickers(query: HeldListQuery) {
  return useQuery({
    queryKey: adminStickerKeys.heldList(query),
    queryFn: () => listHeldStickers(query),
    placeholderData: keepPreviousData,
  })
}

interface Decision {
  id: string
  note?: string
}

export function useStickerModerationActions() {
  const invalidates = [adminStickerKeys.all()]

  const { run: release } = useAdminMutation({
    mutationFn: ({ id, note }: Decision) => releaseSticker(id, note),
    success: "Sticker released.",
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: ({ id, note }: Decision) => removeSticker(id, note),
    success: "Sticker removed everywhere.",
    invalidates,
  })
  const { run: takeDown } = useAdminMutation({
    mutationFn: ({ id, note }: Decision) => takeDownStickerPack(id, note),
    success: "Pack taken down.",
    invalidates,
  })

  return useMemo(
    () => ({
      release: (id: string, note?: string) => release({ id, note }),
      remove: (id: string, note?: string) => remove({ id, note }),
      takeDown: (id: string, note?: string) => takeDown({ id, note }),
    }),
    [release, remove, takeDown]
  )
}
