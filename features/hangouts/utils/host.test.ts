import { describe, expect, it } from "vitest"
import type { SnaccHangout } from "../types"
import { afterAnswer, afterRemoval, othersIn } from "./host"

const hangout = (patch: Partial<SnaccHangout> = {}) =>
  ({
    capacity: 3,
    going_count: 2,
    full: false,
    requests_count: 2,
    ...patch,
  }) as SnaccHangout

describe("host counts", () => {
  it("takes an answered request off the pile, and seats someone let in", () => {
    expect(afterAnswer(hangout(), true)).toMatchObject({
      requests_count: 1,
      going_count: 3,
      full: true,
    })
    expect(afterAnswer(hangout(), false)).toMatchObject({
      requests_count: 1,
      going_count: 2,
    })
  })

  it("frees a seat when someone is removed, never dropping the host", () => {
    expect(afterRemoval(hangout({ going_count: 3, full: true }))).toMatchObject(
      { going_count: 2, full: false }
    )
    expect(afterRemoval(hangout({ going_count: 1 })).going_count).toBe(1)
  })

  it("counts everyone besides the host who has joined or asked", () => {
    expect(othersIn(hangout())).toBe(3)
    expect(othersIn(hangout({ going_count: 1, requests_count: 0 }))).toBe(0)
  })
})
