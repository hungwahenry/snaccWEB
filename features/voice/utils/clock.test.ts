import { describe, expect, it } from "vitest"
import { clock } from "./clock"

describe("clock", () => {
  it("formats minutes and padded seconds", () => {
    expect(clock(0)).toBe("0:00")
    expect(clock(5_000)).toBe("0:05")
    expect(clock(65_000)).toBe("1:05")
    expect(clock(600_000)).toBe("10:00")
  })

  it("rounds to the nearest second", () => {
    expect(clock(1_499)).toBe("0:01")
    expect(clock(1_500)).toBe("0:02")
  })

  it("never goes negative", () => {
    expect(clock(-3_000)).toBe("0:00")
  })
})
