import { describe, expect, it } from "vitest"
import type { EmbeddedSnacc } from "../types"
import { snaccVoiceSource } from "./voice"

const author = {
  id: "u1",
  username: "ada",
  display_name: "Ada",
  avatar_url: "https://media.test/ada.png",
} as EmbeddedSnacc["author"]

describe("snaccVoiceSource", () => {
  it("names the author of the snacc", () => {
    expect(snaccVoiceSource({ id: "s1", anonymous: false, author })).toEqual({
      kind: "snacc",
      id: "s1",
      label: "@ada",
      avatarUrl: "https://media.test/ada.png",
      authorId: "u1",
    })
  })

  it("keeps an anonymous snacc's author hidden", () => {
    expect(snaccVoiceSource({ id: "s1", anonymous: true, author })).toEqual({
      kind: "snacc",
      id: "s1",
      label: "Ghost",
      avatarUrl: null,
      authorId: null,
    })
  })
})
