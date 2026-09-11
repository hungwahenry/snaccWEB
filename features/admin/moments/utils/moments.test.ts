import { describe, expect, it } from "vitest"
import {
  DELETED_OPTIONS,
  DELETED_VALUES,
  HELD_OPTIONS,
  HELD_VALUES,
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
