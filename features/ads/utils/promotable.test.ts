import { describe, expect, it } from "vitest"
import type { Snacc, SnaccClip } from "@/features/snaccs/types"
import { isPromotable } from "./promotable"

const snacc = (patch: Partial<Snacc> = {}) =>
  ({
    id: "01SNACC",
    mine: true,
    parent_id: null,
    held: false,
    body: "hello",
    images: [],
    gif: null,
    sticker: null,
    voice: null,
    clip: null,
    resnacc_of: null,
    ...patch,
  }) as Snacc

const clip = (status: SnaccClip["status"]) => ({ status }) as SnaccClip

describe("isPromotable", () => {
  it("takes your own live post", () => {
    expect(isPromotable(snacc())).toBe(true)
    expect(isPromotable(snacc({ clip: clip("ready") }))).toBe(true)
  })

  it("refuses someone else's, a reply, a held or unsent one, or a clip still processing", () => {
    expect(isPromotable(snacc({ mine: false }))).toBe(false)
    expect(isPromotable(snacc({ parent_id: "01PARENT" }))).toBe(false)
    expect(isPromotable(snacc({ held: true }))).toBe(false)
    expect(isPromotable(snacc({ status: "sending" }))).toBe(false)
    expect(isPromotable(snacc({ clip: clip("processing") }))).toBe(false)
  })

  it("refuses a plain resnacc but takes a quote", () => {
    const original = snacc({ id: "01ORIGINAL" })
    expect(isPromotable(snacc({ body: null, resnacc_of: original }))).toBe(
      false
    )
    expect(isPromotable(snacc({ body: "so true", resnacc_of: original }))).toBe(
      true
    )
  })
})
