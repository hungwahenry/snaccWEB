import { authKeys } from "@/features/auth/utils/keys"
import type { User } from "@/features/users/types"
import { authorFromUser } from "@/features/users/utils/author"
import { showError, showHeld } from "@/lib/feedback"
import { newId } from "@/lib/ids"
import { getQueryClient } from "@/lib/query/client"
import { sendChatMessage, type SendChatMessageInput } from "../api"
import type { ChatDraft } from "../types"
import {
  patchChatMessage,
  removeChatMessage,
  settleChatMessage,
  upsertChatMessage,
} from "."
import {
  buildOptimisticChatMessage,
  draftToInput,
} from "./optimistic-chat-message"

const inputs = new Map<
  string,
  { roomId: string; input: SendChatMessageInput }
>()

async function send(roomId: string, input: SendChatMessageInput) {
  try {
    const real = await sendChatMessage(roomId, input)
    inputs.delete(input.id)
    settleChatMessage(roomId, input.id, real)
    if (real.held) showHeld()
  } catch (error) {
    patchChatMessage(roomId, input.id, (message) => ({
      ...message,
      status: "failed",
    }))
    showError(error)
  }
}

/** Shows the message at once, then sends it; a failure stays in place to retry or drop. */
export function submitChatMessage(roomId: string, draft: ChatDraft): void {
  const me = getQueryClient().getQueryData<User>(authKeys.me())
  if (!me) return

  const id = newId()
  const input = draftToInput(id, draft)
  upsertChatMessage(
    roomId,
    buildOptimisticChatMessage(id, roomId, draft, authorFromUser(me))
  )
  inputs.set(id, { roomId, input })
  void send(roomId, input)
}

export function retryChatMessage(roomId: string, id: string): void {
  const pending = inputs.get(id)
  if (!pending) return
  patchChatMessage(roomId, id, (message) => ({ ...message, status: "sending" }))
  void send(roomId, pending.input)
}

export function discardChatMessage(roomId: string, id: string): void {
  inputs.delete(id)
  removeChatMessage(roomId, id)
}

export function clearPendingChatMessages(): void {
  inputs.clear()
}
