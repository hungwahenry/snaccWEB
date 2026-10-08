"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createStickerPack,
  deleteStickerPack,
  getStickerPack,
  listStickerPacks,
  orderPackStickers,
  publishStickerPack,
  removePackSticker,
  setPackDefault,
  setPackFeatured,
  unpublishStickerPack,
  updateStickerPack,
} from "../api"
import type { PackListQuery, UpdatePackInput } from "../types"
import { adminStickerKeys } from "../utils/keys"
import { packSavedMessage } from "../utils/packs"

export function useStickerPacks(query: PackListQuery) {
  return useQuery({
    queryKey: adminStickerKeys.packList(query),
    queryFn: () => listStickerPacks(query),
    placeholderData: keepPreviousData,
  })
}

export function useStickerPack(id: string) {
  return useQuery({
    queryKey: adminStickerKeys.pack(id),
    queryFn: () => getStickerPack(id),
  })
}

const touched = (id: string) => [
  adminStickerKeys.packLists(),
  adminStickerKeys.pack(id),
]

export function useStickerPackActions() {
  const { run: create } = useAdminMutation({
    mutationFn: (title: string) => createStickerPack(title),
    success: "Pack started as a draft.",
    invalidates: [adminStickerKeys.packLists()],
  })
  const { run: update } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePackInput }) =>
      updateStickerPack(id, input),
    success: (_pack, { input }) => packSavedMessage(input),
    invalidates: (_pack, { id }) => touched(id),
  })
  const { run: publish } = useAdminMutation({
    mutationFn: (id: string) => publishStickerPack(id),
    success: "Published. It's in the catalog.",
    invalidates: (_pack, id) => touched(id),
  })
  const { run: unpublish } = useAdminMutation({
    mutationFn: (id: string) => unpublishStickerPack(id),
    success: "Back to a draft.",
    invalidates: (_pack, id) => touched(id),
  })
  const { run: setDefault } = useAdminMutation({
    mutationFn: ({ id, on }: { id: string; on: boolean }) =>
      setPackDefault(id, on),
    success: (_pack, { on }) =>
      on ? "Added to every tray." : "No longer added for new people.",
    invalidates: (_pack, { id }) => touched(id),
  })
  const { run: setFeatured } = useAdminMutation({
    mutationFn: ({ id, on }: { id: string; on: boolean }) =>
      setPackFeatured(id, on),
    success: (_pack, { on }) =>
      on ? "Featured in the catalog." : "No longer featured.",
    invalidates: (_pack, { id }) => touched(id),
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteStickerPack(id),
    success: "Pack deleted.",
    invalidates: [adminStickerKeys.packLists()],
  })
  const { run: removeSticker } = useAdminMutation({
    mutationFn: ({ id, stickerId }: { id: string; stickerId: string }) =>
      removePackSticker(id, stickerId),
    success: "Sticker taken out of the pack.",
    invalidates: (_result, { id }) => touched(id),
  })
  const { run: order } = useAdminMutation({
    mutationFn: ({ id, stickerIds }: { id: string; stickerIds: string[] }) =>
      orderPackStickers(id, stickerIds),
    success: "Order saved.",
    invalidates: (_result, { id }) => touched(id),
  })

  return useMemo(
    () => ({
      create,
      update: (id: string, input: UpdatePackInput) => update({ id, input }),
      publish,
      unpublish,
      setDefault: (id: string, on: boolean) => setDefault({ id, on }),
      setFeatured: (id: string, on: boolean) => setFeatured({ id, on }),
      remove,
      removeSticker: (id: string, stickerId: string) =>
        removeSticker({ id, stickerId }),
      order: (id: string, stickerIds: string[]) => order({ id, stickerIds }),
    }),
    [
      create,
      update,
      publish,
      unpublish,
      setDefault,
      setFeatured,
      remove,
      removeSticker,
      order,
    ]
  )
}
