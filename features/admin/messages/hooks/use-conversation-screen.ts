"use client"

import { useConversation, useMessageActions } from "./use-messages"

export function useConversationScreen(id: string) {
  return { query: useConversation(id), actions: useMessageActions(id) }
}
