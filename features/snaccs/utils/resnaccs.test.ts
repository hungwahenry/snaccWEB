import { describe, expect, it } from "vitest"
import type { EmbeddedSnacc, Snacc } from "../types"
import { isPlainResnacc } from "./resnaccs"

const resnacc = (patch: Partial<Snacc> = {}) =>
  ({
    body: null,
    images: [],
    gif: null,
    sticker: null,
    voice: null,
    resnacc_of: { id: "original" } as EmbeddedSnacc,
    ...patch,
  }) as Snacc

describe("isPlainResnacc", () => {
  it("is a resnacc that adds nothing of its own", () => {
    expect(isPlainResnacc(resnacc())).toBe(true)
  })

  it("is a quote once it carries anything, a sticker or a voice note included", () => {
    const quotes = [
      resnacc({ body: "look" }),
      resnacc({ images: [{} as Snacc["images"][number]] }),
      resnacc({ gif: {} as Snacc["gif"] }),
      resnacc({ sticker: {} as Snacc["sticker"] }),
      resnacc({
        voice: { id: "v", url: "u", duration_ms: 3000 } as Snacc["voice"],
      }),
    ]

    quotes.forEach((quote) => expect(isPlainResnacc(quote)).toBe(false))
  })

  it("is never a snacc that points at nothing", () => {
    expect(isPlainResnacc(resnacc({ resnacc_of: null }))).toBe(false)
  })
})
