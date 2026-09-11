import { showError } from "@/lib/feedback"
import { newId } from "@/lib/ids"
import { sendMessage, type SendMessageInput } from "../api"
import type { MessageDraft } from "../types"
import { patchMessage, prependMessage, removeMessage, settleMessage } from "."
import { buildOptimisticMessage, draftToInput } from "./optimistic-message"

const inputs = new Map<string, SendMessageInput>()

/** Shows the message at once, then sends it; a failure leaves it in place to retry or drop. */
export function submitMessage(
  conversationId: string,
  draft: MessageDraft
): void {
  const id = newId()
  const input = draftToInput(id, draft)

  prependMessage(conversationId, buildOptimisticMessage(id, draft))
  inputs.set(id, input)
  void send(conversationId, id, input)
}

export function retryMessage(conversationId: string, id: string): void {
  const input = inputs.get(id)
  if (!input) return
  patchMessage(conversationId, id, (message) => ({
    ...message,
    status: "sending",
  }))
  void send(conversationId, id, input)
}

export function discardMessage(conversationId: string, id: string): void {
  inputs.delete(id)
  removeMessage(conversationId, id)
}

async function send(
  conversationId: string,
  id: string,
  input: SendMessageInput
): Promise<void> {
  try {
    const real = await sendMessage(conversationId, input)
    inputs.delete(id)
    settleMessage(conversationId, id, real)
  } catch (error) {
    patchMessage(conversationId, id, (message) => ({
      ...message,
      status: "failed",
    }))
    showError(error)
  }
}

export function clearPendingMessages(): void {
  inputs.clear()
}
