import { describe, expect, it } from "vitest"
import type { SnaccContent } from "../types"
import {
  engagementLine,
  isBlank,
  reportTally,
  snaccBadges,
  snaccPreview,
  snaccStatus,
  STATE_OPTIONS,
} from "./snaccs"

const content = (patch: Partial<SnaccContent> = {}): SnaccContent => ({
  id: "s1",
  body: null,
  created_at: "2026-09-01T00:00:00Z",
  edited_at: null,
  anonymous: false,
  spoiler: false,
  author: {
    id: "u1",
    username: "ada",
    display_name: "Ada",
    avatar_url: "",
    university: null,
  },
  images: [],
  gif: null,
  sticker: null,
  voice: null,
  ...patch,
})

describe("snaccPreview", () => {
  it("prefers the text, then what is attached", () => {
    expect(snaccPreview(content({ body: "hi" }))).toBe("hi")
    expect(
      snaccPreview(content({ images: [{ url: "a" }, { url: "b" }] }))
    ).toBe("2 image(s)")
    expect(snaccPreview(content({ gif: { url: "g" } }))).toBe("GIF")
    expect(snaccPreview(content())).toBe("—")
  })
})

describe("snaccStatus", () => {
  it("puts removed before pinned", () => {
    expect(
      snaccStatus({ deleted_at: "2026-09-01T00:00:00Z", pinned: true }).label
    ).toBe("Removed")
    expect(snaccStatus({ deleted_at: null, pinned: true }).label).toBe("Pinned")
    expect(snaccStatus({ deleted_at: null, pinned: false })).toEqual({
      label: "Live",
      variant: "outline",
    })
  })
})

describe("snaccBadges", () => {
  it("lists only what is unusual", () => {
    expect(
      snaccBadges({ pinned: false, held_at: null, deleted_at: null })
    ).toEqual([])
    expect(
      snaccBadges({
        pinned: true,
        held_at: "2026-09-01T00:00:00Z",
        deleted_at: "2026-09-02T00:00:00Z",
      }).map((badge) => badge.label)
    ).toEqual(["Pinned", "Held", "Removed"])
  })
})

describe("isBlank", () => {
  it("is blank only with no text and nothing attached", () => {
    expect(isBlank(content())).toBe(true)
    expect(isBlank(content({ voice: { url: "v", duration_ms: 1000 } }))).toBe(
      false
    )
  })
})

describe("engagementLine", () => {
  it("shows reactions, replies and views", () => {
    expect(
      engagementLine({ reactions_count: 3, comments_count: 2, views_count: 40 })
    ).toBe("3 rx · 2 co · 40 vw")
  })
})

describe("reportTally", () => {
  it("counts reports and says how many are still open", () => {
    expect(reportTally([{ status: "open" }])).toBe("1 report · 1 open")
    expect(reportTally([{ status: "dismissed" }, { status: "actioned" }])).toBe(
      "2 reports"
    )
  })
})

describe("STATE_OPTIONS", () => {
  it("calls deleted snaccs removed", () => {
    expect(STATE_OPTIONS).toEqual([
      { value: "live", label: "Live" },
      { value: "deleted", label: "Removed" },
    ])
  })
})
