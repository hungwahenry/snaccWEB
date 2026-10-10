import { describe, expect, it } from "vitest"
import {
  DELETED_OPTIONS,
  DELETED_VALUES,
  HELD_OPTIONS,
  HELD_VALUES,
  sharedSnaccLabel,
} from "./moments"

describe("moment filters", () => {
  it("offers a choice for every value the URL accepts", () => {
    expect(HELD_OPTIONS.map((option) => option.value)).toEqual([...HELD_VALUES])
    expect(DELETED_OPTIONS.map((option) => option.value)).toEqual([
      ...DELETED_VALUES,
    ])
  })

  it("names live and removed moments in plain words", () => {
    expect(DELETED_OPTIONS.map((option) => option.label)).toEqual([
      "Live",
      "Removed",
    ])
  })
})

describe("sharedSnaccLabel", () => {
  const author = {
    id: "u1",
    username: "ada",
    display_name: null,
    avatar_url: "",
  }

  it("says whose snacc a moment shares and what it said", () => {
    expect(
      sharedSnaccLabel({ id: "s1", body: "hi", author, deleted: false })
    ).toBe("Shares a snacc by @ada: hi")
    expect(
      sharedSnaccLabel({ id: "s1", body: null, author: null, deleted: true })
    ).toBe("Shares a deleted snacc by someone")
  })
})
