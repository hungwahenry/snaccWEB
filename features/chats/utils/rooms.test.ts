import { describe, expect, it } from "vitest"
import type { ChatMessage, ChatRoom } from "../types"
import { chatBubbleParts } from "./bubble"
import {
  canEditChatMessage,
  chatComposerContext,
  removedLabel,
  roomTitle,
  typingLabel,
  unreadRoomCount,
  withdrawn,
  withMyChatReaction,
} from "./rooms"

const message = (patch: Partial<ChatMessage> = {}): ChatMessage =>
  ({
    id: "m1",
    room_id: "r1",
    body: "hi",
    created_at: new Date().toISOString(),
    edited: false,
    mine: true,
    deleted: false,
    deleted_by_sender: false,
    held: false,
    sender: { id: "u1", username: "ada" },
    images: [],
    voice: null,
    sticker: null,
    gif: null,
    reactions: [],
    reply_to: null,
    ...patch,
  }) as ChatMessage

describe("rooms", () => {
  it("names a room by its campus, or Everyone", () => {
    expect(roomTitle(null)).toBe("Room")
    expect(roomTitle({ campus: null } as ChatRoom)).toBe("Everyone")
    expect(roomTitle({ campus: { acronym: "UI" } } as ChatRoom)).toBe("UI")
  })

  it("counts rooms with something new, leaving muted ones out", () => {
    const rooms = [
      { unread: 3, muted: false },
      { unread: 2, muted: true },
      { unread: 0, muted: false },
    ] as ChatRoom[]
    expect(unreadRoomCount(rooms)).toBe(1)
    expect(unreadRoomCount(undefined)).toBe(0)
  })

  it("turns more than two typists into a count", () => {
    expect(typingLabel([])).toBeNull()
    expect(typingLabel(["@a"])).toBe("@a is typing…")
    expect(typingLabel(["@a", "@b"])).toBe("@a and @b are typing…")
    expect(typingLabel(["@a", "@b", "@c"])).toBe("@a and 2 others are typing…")
  })

  it("says who took a message out", () => {
    expect(removedLabel({ deleted_by_sender: true })).toBe("Message withdrawn")
    expect(removedLabel({ deleted_by_sender: false })).toBe(
      "Removed by a moderator"
    )
  })

  it("lets you edit your own settled message inside the window", () => {
    const now = Date.now()
    const fresh = message({ created_at: new Date(now - 60_000).toISOString() })
    expect(canEditChatMessage(fresh, 15, now)).toBe(true)
    expect(canEditChatMessage({ ...fresh, mine: false }, 15, now)).toBe(false)
    expect(canEditChatMessage({ ...fresh, status: "sending" }, 15, now)).toBe(
      false
    )
    expect(canEditChatMessage(fresh, 0, now)).toBe(false)
    expect(canEditChatMessage(fresh, 15, now + 20 * 60_000)).toBe(false)
  })

  it("leaves only the gap once withdrawn", () => {
    const gone = withdrawn(
      message({
        voice: { id: "v", url: "u", duration_ms: 1 },
        reactions: [{ emoji: "🔥", count: 1, mine: true }],
      })
    )
    expect(gone).toMatchObject({
      deleted: true,
      deleted_by_sender: true,
      body: null,
      voice: null,
      reactions: [],
    })
  })
})

describe("chatComposerContext", () => {
  it("is nothing when neither editing nor replying", () => {
    expect(chatComposerContext({ editing: null, replyingTo: null })).toBeNull()
  })

  it("names who you answer and carries their voice note", () => {
    const context = chatComposerContext({
      editing: null,
      replyingTo: message({
        mine: false,
        body: null,
        voice: { id: "v", url: "u", duration_ms: 3000 },
      }),
    })
    expect(context?.label).toBe("Replying to @ada")
    expect(context?.glimpse.media).toMatchObject({ kind: "voice" })
  })

  it("prefers the edit over the reply", () => {
    expect(
      chatComposerContext({ editing: message(), replyingTo: message() })?.kind
    ).toBe("edit")
  })
})

describe("chatBubbleParts", () => {
  it("draws words in a bubble and photos loose", () => {
    const parts = chatBubbleParts(
      message({ images: [{ id: "i" } as ChatMessage["images"][number]] })
    )
    expect(parts.bubbled).toBe(true)
    expect(parts.images).toHaveLength(1)
  })

  it("leaves a lone sticker out of the bubble", () => {
    const parts = chatBubbleParts(
      message({
        body: null,
        sticker: { sticker_id: "s" } as ChatMessage["sticker"],
      })
    )
    expect(parts.bubbled).toBe(false)
  })

  it("quotes the message answered, naming who said it", () => {
    const parts = chatBubbleParts(
      message({
        reply_to: {
          id: "r",
          body: "earlier",
          sender_username: "bo",
          deleted: false,
          has_images: false,
          has_sticker: false,
          has_gif: false,
          has_voice: false,
        },
      })
    )
    expect(parts.replyAuthor).toBe("@bo")
    expect(parts.reply?.text).toBe("earlier")
  })

  it("draws only the gap once removed", () => {
    const parts = chatBubbleParts(
      message({ deleted: true, deleted_by_sender: false, body: null })
    )
    expect(parts).toMatchObject({
      removedText: "Removed by a moderator",
      bubbled: true,
      images: [],
    })
  })
})

describe("withMyChatReaction", () => {
  const reacted = message({
    reactions: [
      { emoji: "🔥", count: 2, mine: true },
      { emoji: "😂", count: 1, mine: false },
    ],
  })

  it("moves your reaction, keeping the counts right", () => {
    expect(withMyChatReaction(reacted, "😂").reactions).toEqual([
      { emoji: "🔥", count: 1, mine: false },
      { emoji: "😂", count: 2, mine: true },
    ])
  })

  it("takes yours back, dropping an emoji nobody holds", () => {
    const alone = message({
      reactions: [{ emoji: "🔥", count: 1, mine: true }],
    })
    expect(withMyChatReaction(alone, null).reactions).toEqual([])
  })

  it("adds a new emoji at one", () => {
    expect(withMyChatReaction(message(), "🎉").reactions).toEqual([
      { emoji: "🎉", count: 1, mine: true },
    ])
  })
})
