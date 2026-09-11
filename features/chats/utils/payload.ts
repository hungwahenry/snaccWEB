import type {
  ChatMessage,
  ChatMessagePayload,
  RoomMessagePayload,
} from "../types"

/** An answer to you names your reaction beside the counts; fold it in where the bubble reads it. */
export function fromPayload(payload: ChatMessagePayload): ChatMessage {
  const { my_reaction: mine, ...message } = payload
  return {
    ...message,
    reactions: payload.reactions.map((reaction) => ({
      ...reaction,
      mine: reaction.emoji === mine,
    })),
  }
}

/** A room broadcast knows nothing about you: whose it is comes from who you are, and your
 * reaction from the copy already on screen. */
export function claimPayload(
  payload: RoomMessagePayload,
  meId: string | undefined,
  before: ChatMessage | undefined
): ChatMessage {
  return {
    ...payload,
    mine: meId !== undefined && meId === payload.sender.id,
    reactions: payload.reactions.map((reaction) => ({
      ...reaction,
      mine:
        before?.reactions.some(
          (each) => each.mine && each.emoji === reaction.emoji
        ) ?? false,
    })),
  }
}
