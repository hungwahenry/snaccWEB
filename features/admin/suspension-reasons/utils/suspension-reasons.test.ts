import { describe, expect, it } from "vitest"
import type { SuspensionReason } from "../types"
import {
  DEFAULT_TITLE,
  draftFrom,
  isDraftReady,
  sortReasons,
  toCreateInput,
} from "./suspension-reasons"

const reason: SuspensionReason = {
  id: "r1",
  slug: "harassment",
  label: "Harassment",
  title: "Your account is suspended",
  description: "You were unkind.",
  position: 3,
  retired: false,
  created_at: "2026-01-01T00:00:00Z",
}

describe("suspension reason drafts", () => {
  it("starts new reasons with the usual heading", () => {
    expect(draftFrom()).toMatchObject({ title: DEFAULT_TITLE, position: "0" })
    expect(draftFrom(reason)).toMatchObject({
      slug: "harassment",
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

  it("trims and converts the position", () => {
    expect(
      toCreateInput({
        ...draftFrom(reason),
        label: " Harassment ",
        position: "7",
      })
    ).toEqual({
      slug: "harassment",
      label: "Harassment",
      title: "Your account is suspended",
      description: "You were unkind.",
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
