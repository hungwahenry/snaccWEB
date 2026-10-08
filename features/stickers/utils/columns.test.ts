import { describe, expect, it } from "vitest"
import { columnsOf } from "./columns"

describe("columnsOf", () => {
  it("deals items across columns in turn", () => {
    expect(columnsOf([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 3, 5],
      [2, 4],
    ])
  })

  it("always makes at least one column", () => {
    expect(columnsOf([1, 2], 0)).toEqual([[1, 2]])
  })
})
