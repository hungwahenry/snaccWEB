import { describe, expect, it } from "vitest"
import type { AdReason } from "../types"
import {
  draftFrom,
  isDraftReady,
  pickableReasons,
  sortReasons,
  toCreateInput,
} from "./ad-reasons"

const reason: AdReason = {
  id: "r1",
  slug: "alcohol",
  label: "Alcohol",
  description: "We don't promote alcohol.",
  prohibited: true,
  position: 3,
  retired: false,
  created_at: "2026-01-01T00:00:00Z",
}

describe("ad reason drafts", () => {
  it("starts new reasons empty and allowed", () => {
    expect(draftFrom()).toEqual({
      slug: "",
      label: "",
      description: "",
      prohibited: false,
      position: "0",
    })
    expect(draftFrom(reason)).toMatchObject({
      slug: "alcohol",
      prohibited: true,
      position: "3",
    })
  })

  it("needs every field and a sensible position", () => {
    const draft = draftFrom(reason)
    expect(isDraftReady(draft)).toBe(true)
    expect(isDraftReady({ ...draft, description: " " })).toBe(false)
    expect(isDraftReady({ ...draft, position: "1.5" })).toBe(false)
    expect(isDraftReady({ ...draft, position: "1001" })).toBe(false)
  })

  it("trims, converts the position and keeps the not-allowed switch", () => {
    expect(
      toCreateInput({ ...draftFrom(reason), label: " Alcohol ", position: "7" })
    ).toEqual({
      slug: "alcohol",
      label: "Alcohol",
      description: "We don't promote alcohol.",
      prohibited: true,
      position: 7,
    })
  })
})

describe("sortReasons", () => {
  it("puts reasons in use first, by position then name", () => {
    const sorted = sortReasons([
      { ...reason, id: "c", label: "C", position: 1, retired: true },
      { ...reason, id: "b", label: "B", position: 2 },
      { ...reason, id: "a", label: "A", position: 2 },
      { ...reason, id: "d", label: "D", position: 0 },
    ])
    expect(sorted.map((each) => each.id)).toEqual(["d", "a", "b", "c"])
  })
})

describe("pickableReasons", () => {
  it("drops retired reasons from the reject picker", () => {
    expect(
      pickableReasons([
        { ...reason, id: "b", position: 2 },
        { ...reason, id: "x", position: 0, retired: true },
        { ...reason, id: "a", position: 1 },
      ]).map((each) => each.id)
    ).toEqual(["a", "b"])
  })
})
