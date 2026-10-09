"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { chatThemeKeys } from "@/features/chat-themes/utils/keys"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createChatTheme,
  deleteChatTheme,
  listChatThemes,
  updateChatTheme,
  uploadChatThemeImage,
} from "../api"
import type { ChatThemeDraft, UpdateChatThemeInput } from "../types"
import {
  chatThemeMessage,
  toCreateInput,
  toUpdateInput,
} from "../utils/chat-themes"
import { adminChatThemeKeys } from "../utils/keys"

export function useAdminChatThemes() {
  return useQuery({
    queryKey: adminChatThemeKeys.list(),
    queryFn: listChatThemes,
  })
}

export function useChatThemeActions() {
  const queryClient = useQueryClient()
  const invalidates = [adminChatThemeKeys.all(), chatThemeKeys.catalog()]

  const { run: update } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateChatThemeInput }) =>
      updateChatTheme(id, input),
    success: (theme, { input }) => chatThemeMessage(theme, input),
    invalidates,
  })
  const { run: save } = useAdminMutation({
    mutationFn: async ({
      draft,
      id,
    }: {
      draft: ChatThemeDraft
      id?: string
    }) => {
      const saved = id
        ? await updateChatTheme(id, toUpdateInput(draft))
        : await createChatTheme(toCreateInput(draft))
      if (!draft.picture) return saved

      try {
        return await uploadChatThemeImage(saved.id, draft.picture)
      } catch (error) {
        await queryClient.invalidateQueries({
          queryKey: adminChatThemeKeys.all(),
        })
        throw new Error(
          `${saved.label} was saved, but its picture didn't upload: ${getErrorMessage(error)} Edit it to try again.`
        )
      }
    },
    success: (theme, { id }) =>
      id
        ? `${theme.label} saved.`
        : `${theme.label} added. Switch it on when it's ready.`,
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteChatTheme(id),
    success: "Theme deleted.",
    invalidates,
  })

  return useMemo(
    () => ({
      setEnabled: (id: string, enabled: boolean) =>
        update({ id, input: { enabled } }),
      setPremium: (id: string, premium: boolean) =>
        update({ id, input: { premium } }),
      save: (draft: ChatThemeDraft, id?: string) => save({ draft, id }),
      remove,
    }),
    [update, save, remove]
  )
}
