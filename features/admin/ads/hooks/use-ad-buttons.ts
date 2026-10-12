"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { createAdButton, listAdButtons, updateAdButton } from "../api"
import type { AdButtonDraft } from "../types"
import {
  sortButtons,
  toCreateButtonInput,
  toUpdateButtonInput,
} from "../utils/ad-buttons"
import { adminAdKeys } from "../utils/keys"

export function useAdButtons() {
  return useQuery({
    queryKey: adminAdKeys.buttons(),
    queryFn: listAdButtons,
    select: sortButtons,
  })
}

export function useAdButtonActions() {
  const invalidates = [adminAdKeys.buttons()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: AdButtonDraft; id?: string }) =>
      id
        ? updateAdButton(id, toUpdateButtonInput(draft))
        : createAdButton(toCreateButtonInput(draft)),
    success: (_button, { id }) => (id ? "Label saved." : "Label added."),
    invalidates,
  })
  const { run: setRetired } = useAdminMutation({
    mutationFn: ({ id, retired }: { id: string; retired: boolean }) =>
      updateAdButton(id, { retired }),
    success: (_button, { retired }) =>
      retired ? "Label retired." : "Label restored.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: AdButtonDraft, id?: string) => save({ draft, id }),
      setRetired: (id: string, retired: boolean) => setRetired({ id, retired }),
    }),
    [save, setRetired]
  )
}
