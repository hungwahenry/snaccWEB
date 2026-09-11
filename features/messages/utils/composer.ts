import type { ComposerContext, Message, MessageGlimpse } from "../types"
import { messageGlimpse } from "./glimpse"
import { removedLabel } from "./preview"

/** How close to the limit the character counter appears. */
export const COUNTER_WITHIN = 100

export function glimpseOfMessage(message: Message): MessageGlimpse {
  return messageGlimpse(message, removedLabel(message))
}

export function composerContext(input: {
  editing: Message | null
  replyingTo: Message | null
}): ComposerContext | null {
  if (input.editing) {
    return {
      kind: "edit",
      label: "Editing your message",
      glimpse: glimpseOfMessage(input.editing),
      hint: "Cancel edit",
    }
  }

  const reply = input.replyingTo
  if (!reply) return null

  return {
    kind: "reply",
    label: `Replying to ${reply.mine ? "yourself" : "them"}`,
    glimpse: glimpseOfMessage(reply),
    hint: "Cancel reply",
  }
}

/** False while an edit still says exactly what the message already says. */
export function editChanged(
  editing: { body: string | null } | null,
  trimmed: string
): boolean {
  return !editing || trimmed !== (editing.body ?? "")
}
