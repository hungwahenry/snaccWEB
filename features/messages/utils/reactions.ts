import type { Message } from "../types"

/** Anything with reactions you can hold one of: a DM or a room message. */
type Reacted = { reactions: { emoji: string; mine: boolean }[] }

export function myReaction(message: Reacted | null): string | null {
  return message?.reactions.find((reaction) => reaction.mine)?.emoji ?? null
}

/** Picking the emoji you already chose takes it back. */
export function nextReaction(
  message: Reacted | null,
  emoji: string
): string | null {
  return myReaction(message) === emoji ? null : emoji
}

/** The message as it looks once your reaction is set to `emoji`, or cleared when null. */
export function withMyReaction(
  message: Message,
  emoji: string | null
): Message {
  const others = message.reactions.filter((reaction) => !reaction.mine)
  return {
    ...message,
    reactions: emoji ? [...others, { emoji, mine: true }] : others,
  }
}
