import { describe, expect, it } from "vitest"
import { moneyTabs, sectionTitle, visibleSection } from "./money-sections"

describe("money sections", () => {
  it("drops the earnings tab when earnings is off", () => {
    expect(moneyTabs(true).map((tab) => tab.key)).toContain("earnings")
    expect(moneyTabs(false).map((tab) => tab.key)).not.toContain("earnings")
  })

  it("keeps the same tabs between renders", () => {
    expect(moneyTabs(false)).toBe(moneyTabs(false))
  })

  it("falls back to home once earnings goes away", () => {
    expect(visibleSection("earnings", false)).toBe("home")
    expect(visibleSection("earnings", true)).toBe("earnings")
    expect(visibleSection("requests", false)).toBe("requests")
  })

  it("titles each section", () => {
    expect(sectionTitle("home")).toBe("Money")
    expect(sectionTitle("earnings")).toBe("Monetisation")
  })
})
