import { describe, expect, it } from "vitest"
import { DAY_MS } from "@/lib/duration"
import { refusalActive } from "./age-refusal"

describe("refusalActive", () => {
  const now = 1_800_000_000_000

  it("holds the browser for the cooldown after a refusal", () => {
    expect(refusalActive(now - 60_000, now, DAY_MS)).toBe(true)
    expect(refusalActive(now - DAY_MS + 1, now, DAY_MS)).toBe(true)
  })

  it("lets go once the cooldown is over, or when nothing was refused", () => {
    expect(refusalActive(now - DAY_MS, now, DAY_MS)).toBe(false)
    expect(refusalActive(0, now, DAY_MS)).toBe(false)
    expect(refusalActive(Number("on"), now, DAY_MS)).toBe(false)
  })
})
