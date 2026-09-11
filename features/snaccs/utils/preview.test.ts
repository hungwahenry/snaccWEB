import { describe, expect, it } from "vitest"
import type { GlimpsedSnacc } from "../types"
import { attachmentSummary, glimpseOf, quotingLabel } from "./preview"

const image = (n: number) => ({
  id: `i${n}`,
  url: `https://cdn/${n}.jpg`,
  thumb_url: `https://cdn/${n}-t.jpg`,
  width: 10,
  height: 10,
  position: n,
})

const snacc = (patch: Partial<GlimpsedSnacc> = {}) =>
  ({
    body: null,
    spoiler: false,
    images: [],
    voice: null,
    gif: null,
    sticker: null,
    poll: null,
    match: null,
    resnacc_of: null,
    ...patch,
  }) as GlimpsedSnacc

describe("glimpseOf", () => {
  it("keeps the words and the voice note", () => {
    const voice = { id: "v", url: "u", duration_ms: 3000 }
    expect(glimpseOf(snacc({ body: "  hey  ", voice }))).toMatchObject({
      body: "hey",
      voice,
      chips: [],
    })
  })

  it("shows up to four photos and counts the rest", () => {
    const glimpse = glimpseOf(snacc({ images: [1, 2, 3, 4, 5, 6].map(image) }))
    expect(glimpse.thumbs?.urls).toHaveLength(4)
    expect(glimpse.thumbs?.extra).toBe(2)
  })

  it("hides sensitive media behind a chip", () => {
    const glimpse = glimpseOf(snacc({ spoiler: true, images: [image(1)] }))
    expect(glimpse.thumbs).toBeNull()
    expect(glimpse.chips).toEqual([
      { kind: "sensitive", label: "Sensitive photo" },
    ])
  })

  it("names a poll and a quote as chips", () => {
    const glimpse = glimpseOf(
      snacc({
        poll: { options: [{}, {}] } as GlimpsedSnacc["poll"],
        resnacc_of: {
          anonymous: false,
          author: { username: "ada" },
        } as GlimpsedSnacc["resnacc_of"],
      })
    )
    expect(glimpse.chips.map((chip) => chip.label)).toEqual([
      "Poll · 2 options",
      "Quoting @ada",
    ])
  })
})

describe("quotingLabel", () => {
  it("keeps a Ghost anonymous", () => {
    expect(
      quotingLabel({ anonymous: true, author: { username: "ada" } } as never)
    ).toBe("Quoting Ghost")
  })
})

describe("attachmentSummary", () => {
  it("names what there is, most telling first", () => {
    const none = {
      poll: false,
      voiceMs: null,
      sticker: false,
      gif: false,
      images: 0,
    }
    expect(attachmentSummary({ ...none, poll: true, images: 2 })).toBe(
      "📊 Poll"
    )
    expect(attachmentSummary({ ...none, images: 3 })).toBe("📷 3 photos")
    expect(attachmentSummary(none)).toBeNull()
  })
})
