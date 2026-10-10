"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { HOUR_MS } from "@/lib/duration"
import { getAllChatsTheme } from "../api"
import { messageKeys } from "../utils/keys"

export function useAllChatsTheme() {
  const themesOn = useFlag("chat_themes")
  const messagesOn = useFlag("anon_messages")
  const enabled = themesOn && messagesOn
  const query = useQuery({
    queryKey: messageKeys.allChatsTheme(),
    queryFn: getAllChatsTheme,
    enabled,
    staleTime: HOUR_MS,
  })

  return {
    theme: enabled ? (query.data ?? null) : null,
    loaded: query.data !== undefined,
    loading: query.isLoading,
    failed: query.isError,
    refetch: query.refetch,
  }
}
