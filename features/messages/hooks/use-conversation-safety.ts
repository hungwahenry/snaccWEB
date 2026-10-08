"use client"

import { confirm } from "@/components/ui/confirm"
import type { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import type { Conversation } from "../types"
import { safetyActions, type SafetyAction } from "../utils/safety"
import { useConfirmReveal } from "./use-confirm-reveal"
import { useConversationActions } from "./use-conversation-actions"

export function useConversationSafety(
  id: string,
  conversation: Conversation | null,
  report: ReturnType<typeof useReportSheet>
) {
  const { block, unblock } = useConversationActions(id)
  const confirmReveal = useConfirmReveal(id)
  const other = conversation?.other ?? null

  const handlers: Record<SafetyAction, () => void> = {
    reveal: confirmReveal,
    report: () => {
      if (other?.id)
        report.open({ type: "user", id: other.id, username: other.username })
    },
    block: () =>
      confirm({
        title: "Block this person?",
        message: "They will never be able to message you again.",
        actions: [
          { label: "Block", destructive: true, onPress: () => block.mutate() },
        ],
      }),
    unblock: () => unblock.mutate(),
  }

  return {
    actions: conversation ? safetyActions(conversation) : [],
    onAction: (action: SafetyAction) => handlers[action](),
  }
}
