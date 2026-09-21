import { describe, expect, it } from "vitest"
import type { StoredDraft } from "../types"
import { draftPreview, toDraftSeed } from "./drafts"

const draft = (patch: Partial<StoredDraft> = {}): StoredDraft => ({
  id: "d1",
  saved_at: "2026-10-01T00:00:00Z",
  body: "",
  spoiler: false,
  images: [],
  voice: null,
  gif: null,
  sticker: null,
  poll: null,
  ...patch,
})

const hangout = {
  title: "watch the derby",
  emoji: "⚽",
  place: "SUB",
  startsAt: null,
  capacity: 6,
  private: false,
}

describe("drafts", () => {
  it("previews the words first, then a hangout by its title", () => {
    expect(draftPreview(draft({ body: "  hi  " }))).toBe("hi")
    expect(draftPreview(draft({ hangout }))).toBe("⚽ watch the derby")
    expect(draftPreview(draft({ hangout: { ...hangout, title: " " } }))).toBe(
      "⚽ Hangout"
    )
    expect(draftPreview(draft())).toBe("Empty draft")
  })

  it("keeps a hangout, and reads a draft saved before hangouts as having none", () => {
    expect(toDraftSeed(draft({ hangout })).hangout).toEqual(hangout)
    expect(toDraftSeed(draft()).hangout).toBeNull()
  })
})
