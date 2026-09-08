import type { Message } from "../types"

export function myReaction(message: Message | null): string | null {
  return message?.reactions.find((reaction) => reaction.mine)?.emoji ?? null
}

export function nextReaction(
  message: Message | null,
  emoji: string
): string | null {
  return myReaction(message) === emoji ? null : emoji
}
