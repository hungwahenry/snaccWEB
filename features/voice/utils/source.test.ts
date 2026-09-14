import { describe, expect, it } from "vitest"
import { isFromSource, voiceSource } from "./source"

const ada = {
  id: "u1",
  username: "ada",
  display_name: "Ada",
  avatar_url: "https://media.test/ada.png",
}

describe("voiceSource", () => {
  it("names the person by their handle", () => {
    expect(voiceSource("snacc", "s1", ada)).toEqual({
      kind: "snacc",
      id: "s1",
      label: "@ada",
      avatarUrl: "https://media.test/ada.png",
      authorId: "u1",
    })
  })

  it("falls back to their name, then Ghost, when there is no handle", () => {
    expect(voiceSource("chat", "r1", { ...ada, username: null }).label).toBe(
      "Ada"
    )
    const hidden = voiceSource("conversation", "c1", {
      ...ada,
      username: null,
      display_name: null,
      avatar_url: "",
    })
    expect(hidden.label).toBe("Ghost")
    expect(hidden.avatarUrl).toBeNull()
  })

  it("is Ghost with no one behind it", () => {
    expect(voiceSource("snacc", "s1", null)).toEqual({
      kind: "snacc",
      id: "s1",
      label: "Ghost",
      avatarUrl: null,
      authorId: null,
    })
  })
})

describe("isFromSource", () => {
  const snacc = voiceSource("snacc", "s1", ada)

  it("matches the snacc it came from", () => {
    expect(isFromSource(snacc, { snaccId: "s1" })).toBe(true)
    expect(isFromSource(snacc, { snaccId: "s2" })).toBe(false)
  })

  it("matches who posted it", () => {
    expect(isFromSource(snacc, { authorId: "u1" })).toBe(true)
    expect(isFromSource(snacc, { authorId: "u2" })).toBe(false)
  })

  it("only matches a snacc id against a snacc", () => {
    const room = voiceSource("chat", "s1", ada)
    expect(isFromSource(room, { snaccId: "s1" })).toBe(false)
  })

  it("never ties a Ghost note to anyone", () => {
    expect(
      isFromSource(voiceSource("snacc", "s1", null), { authorId: "u1" })
    ).toBe(false)
  })

  it("is false with nothing playing", () => {
    expect(isFromSource(null, { snaccId: "s1", authorId: "u1" })).toBe(false)
  })
})
