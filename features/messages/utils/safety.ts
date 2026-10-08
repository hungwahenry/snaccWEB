import type { Conversation } from "../types"

export type SafetyAction = "reveal" | "report" | "block" | "unblock"

export function safetyActions(conversation: Conversation): SafetyAction[] {
  const actions: SafetyAction[] = []
  if (conversation.can_reveal) actions.push("reveal")
  if (conversation.other.id) actions.push("report")
  if (!conversation.you_are_ghost) {
    actions.push(conversation.blocked ? "unblock" : "block")
  }
  return actions
}

export function anonymityNote(conversation: Conversation): string | null {
  if (conversation.revealed) return null
  return conversation.you_are_ghost
    ? "You're anonymous to them."
    : "They're anonymous until they reveal themselves."
}
