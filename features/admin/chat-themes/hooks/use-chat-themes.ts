"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listChatThemes, updateChatTheme } from "../api"
import type { UpdateChatThemeInput } from "../types"
import { chatThemeMessage } from "../utils/chat-themes"
import { adminChatThemeKeys } from "../utils/keys"

export function useAdminChatThemes() {
  return useQuery({
    queryKey: adminChatThemeKeys.list(),
    queryFn: listChatThemes,
  })
}

export function useChatThemeActions() {
  const { run: update } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateChatThemeInput }) =>
      updateChatTheme(id, input),
    success: (theme, { input }) => chatThemeMessage(theme, input),
    invalidates: [adminChatThemeKeys.all()],
  })

  return useMemo(
    () => ({
      setEnabled: (id: string, enabled: boolean) =>
        update({ id, input: { enabled } }),
      setPremium: (id: string, premium: boolean) =>
        update({ id, input: { premium } }),
    }),
    [update]
  )
}
