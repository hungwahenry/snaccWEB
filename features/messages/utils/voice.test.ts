import { describe, expect, it } from "vitest"
import type { User } from "@/features/users/types"
import type { MessageParty } from "../types"
import { conversationVoiceSources, voiceSourceOf } from "./voice"

const me = {
  id: "me",
  profile: {
    username: "bola",
    display_name: "Bola",
    avatar_url: "https://media.test/bola.png",
  },
} as User

const other = {
  id: "u2",
  username: "ada",
  display_name: null,
  avatar_url: "https://media.test/ada.png",
} as MessageParty

describe("conversationVoiceSources", () => {
  it("names each side of the conversation", () => {
    const sources = conversationVoiceSources("c1", me, other)

    expect(sources.mine).toEqual({
      kind: "conversation",
      id: "c1",
      label: "@bola",
      avatarUrl: "https://media.test/bola.png",
      authorId: "me",
    })
    expect(sources.theirs).toEqual({
      kind: "conversation",
      id: "c1",
      label: "@ada",
      avatarUrl: "https://media.test/ada.png",
      authorId: "u2",
    })
  })

  it("reads Ghost for someone writing anonymously", () => {
    const hidden = { ...other, username: null, display_name: null }
    expect(conversationVoiceSources("c1", me, hidden).theirs.label).toBe(
      "Ghost"
    )
  })
})

describe("voiceSourceOf", () => {
  it("picks the side that sent the message", () => {
    const sources = conversationVoiceSources("c1", me, other)
    expect(voiceSourceOf({ mine: true }, sources)).toBe(sources.mine)
    expect(voiceSourceOf({ mine: false }, sources)).toBe(sources.theirs)
  })
})
