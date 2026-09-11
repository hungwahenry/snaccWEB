"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { createPrompt, deletePrompt, listPrompts, updatePrompt } from "../api"
import type { PromptDraft } from "../types"
import { adminPromptKeys } from "../utils/keys"
import { toInput } from "../utils/prompt"

export function usePrompts() {
  return useQuery({ queryKey: adminPromptKeys.list(), queryFn: listPrompts })
}

export function usePromptActions() {
  const invalidates = [adminPromptKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: PromptDraft; id?: string }) =>
      id ? updatePrompt(id, toInput(draft)) : createPrompt(toInput(draft)),
    success: (_prompt, { id }) => (id ? "Prompt saved." : "Prompt added."),
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deletePrompt(id),
    success: "Prompt deleted.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: PromptDraft, id?: string) => save({ draft, id }),
      remove,
    }),
    [save, remove]
  )
}
