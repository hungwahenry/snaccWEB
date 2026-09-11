"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createEgg,
  deleteEgg,
  listEggs,
  removeEggImage,
  updateEgg,
  uploadEggImage,
} from "../api"
import type { EggDraft } from "../types"
import { toCreateInput, toUpdateInput } from "../utils/egg"
import { adminEggKeys } from "../utils/keys"

export function useEggs() {
  return useQuery({ queryKey: adminEggKeys.list(), queryFn: listEggs })
}

export function useEggActions() {
  const invalidates = [adminEggKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: EggDraft; id?: string }) =>
      id
        ? updateEgg(id, toUpdateInput(draft))
        : createEgg(toCreateInput(draft)),
    success: (_egg, { id }) => (id ? "Egg saved." : "Egg hidden."),
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteEgg(id),
    success: "Egg deleted.",
    invalidates,
  })
  const { run: uploadArt } = useAdminMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadEggImage(id, file),
    success: "Artwork saved.",
    invalidates,
  })
  const { run: removeArt } = useAdminMutation({
    mutationFn: (id: string) => removeEggImage(id),
    success: "Artwork removed.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: EggDraft, id?: string) => save({ draft, id }),
      remove,
      uploadArt: (id: string, file: File) => uploadArt({ id, file }),
      removeArt,
    }),
    [save, remove, uploadArt, removeArt]
  )
}
