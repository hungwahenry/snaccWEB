import { describe, expect, it } from "vitest"
import type { SuspensionReason } from "../types"
import {
  durationOptions,
  EMPTY_SUSPENSION,
  pickableReasons,
  toSuspendInput,
} from "./suspension"

const reason = (
  id: string,
  position: number,
  retired = false
): SuspensionReason => ({
  id,
  slug: id,
  label: id,
  title: "",
  description: "",
  position,
  retired,
  created_at: "2026-01-01T00:00:00Z",
})

describe("durationOptions", () => {
  it("offers no end date first, then the configured days", () => {
    expect(durationOptions(["1", "7", "0"])).toEqual([
      { value: "0", label: "Until someone lifts it" },
      { value: "1", label: "1 day" },
      { value: "7", label: "7 days" },
    ])
  })
})

describe("pickableReasons", () => {
  it("drops retired reasons and keeps their order", () => {
    expect(
      pickableReasons([
        reason("b", 2),
        reason("x", 0, true),
        reason("a", 1),
      ]).map((each) => each.id)
    ).toEqual(["a", "b"])
  })
})

describe("toSuspendInput", () => {
  const now = Date.parse("2026-09-01T10:00:00Z")

  it("sends no end date for an open-ended suspension", () => {
    expect(toSuspendInput(EMPTY_SUSPENSION, "", now)).toEqual({
      reasonId: undefined,
      note: undefined,
      until: undefined,
    })
  })

  it("works out the end date and keeps the note", () => {
    expect(
      toSuspendInput({ reasonId: "r1", days: "3" }, "  repeat offender ", now)
    ).toEqual({
      reasonId: "r1",
      note: "repeat offender",
      until: "2026-09-04T10:00:00.000Z",
    })
  })
})
