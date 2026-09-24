import { describe, expect, it } from "vitest"
import { reasonLabel, REFERRAL_STATUS, STATUS_OPTIONS } from "./status"

describe("reasonLabel", () => {
  it("explains the rules the sweep names", () => {
    expect(reasonLabel("same_device")).toBe("Same device as the inviter")
    expect(reasonLabel("inactive")).toBe("Never really used Snacc")
  })

  it("shows an admin’s own note as written", () => {
    expect(reasonLabel("Same person twice")).toBe("Same person twice")
    expect(reasonLabel(null)).toBeNull()
  })
})

describe("STATUS_OPTIONS", () => {
  it("offers every status with its label", () => {
    expect(STATUS_OPTIONS.map((option) => option.value)).toEqual([
      "pending",
      "qualified",
      "held",
      "paid",
      "void",
    ])
    expect(STATUS_OPTIONS[2].label).toBe(REFERRAL_STATUS.held.label)
  })
})
