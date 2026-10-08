"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { HOUR_MS } from "@/lib/duration"
import { listChatThemes } from "../api"
import { chatThemeKeys } from "../utils/keys"

export function useChatThemes() {
  return useQuery({
    queryKey: chatThemeKeys.catalog(),
    queryFn: listChatThemes,
    enabled: useFlag("chat_themes"),
    staleTime: HOUR_MS,
  })
}
