import {
  bumpRoom,
  claimBroadcast,
  patchChatMessage,
  removeChatMessage,
  setRoomLocked,
  upsertChatMessage,
} from "./cache"
import type { RoomMessagePayload } from "./types"

type RoomPayload = { room_id: string; message: RoomMessagePayload }

export function onChatMessage({
  room_id,
  message: payload,
}: RoomPayload): void {
  const message = claimBroadcast(room_id, payload)
  if (message.held && !message.mine) return

  upsertChatMessage(room_id, message)
  if (!message.mine) bumpRoom(room_id, message.created_at)
}

export function onChatMessageUpdated(payload: RoomPayload): void {
  settle(payload)
}

export function onChatMessageRemoved(payload: RoomPayload): void {
  settle(payload)
}

export function onChatRoomUpdated(payload: {
  room_id: string
  locked: boolean
}): void {
  setRoomLocked(payload.room_id, payload.locked)
}

/** A held message is taken back from everyone but its sender. The broadcast carries none of its
 * words, so the sender keeps the copy they already have and only learns it is held. */
function settle({ room_id, message: payload }: RoomPayload): void {
  const message = claimBroadcast(room_id, payload)

  if (message.held && !message.mine) {
    removeChatMessage(room_id, message.id)
  } else if (message.held) {
    patchChatMessage(room_id, message.id, (cached) => ({
      ...cached,
      held: true,
    }))
  } else {
    upsertChatMessage(room_id, message)
  }
}
