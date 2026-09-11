import { describe, expect, it } from "vitest"
import type {
  ChatMessage,
  ChatMessagePayload,
  RoomMessagePayload,
} from "../types"
import { claimPayload, fromPayload } from "./payload"

const payload = {
  id: "m1",
  room_id: "r1",
  body: "hi",
  sender: { id: "u1" },
  reactions: [
    { emoji: "🔥", count: 2 },
    { emoji: "😂", count: 1 },
  ],
} as RoomMessagePayload

describe("fromPayload", () => {
  it("marks your reaction among the counts", () => {
    const message = fromPayload({
      ...payload,
      mine: false,
      my_reaction: "😂",
    } as ChatMessagePayload)

    expect(message.reactions).toEqual([
      { emoji: "🔥", count: 2, mine: false },
      { emoji: "😂", count: 1, mine: true },
    ])
    expect(message).not.toHaveProperty("my_reaction")
  })
})

describe("claimPayload", () => {
  it("knows it is yours from who you are", () => {
    expect(claimPayload(payload, "u1", undefined).mine).toBe(true)
    expect(claimPayload(payload, "u2", undefined).mine).toBe(false)
    expect(claimPayload(payload, undefined, undefined).mine).toBe(false)
  })

  it("keeps your reaction from the copy on screen", () => {
    const before = {
      reactions: [{ emoji: "🔥", count: 1, mine: true }],
    } as ChatMessage
    const claimed = claimPayload(payload, "u2", before)
    expect(claimed.reactions.find((r) => r.emoji === "🔥")?.mine).toBe(true)
    expect(claimed.reactions.find((r) => r.emoji === "😂")?.mine).toBe(false)
  })
})
