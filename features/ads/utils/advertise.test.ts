import { describe, expect, it } from "vitest"
import { advertiseFacts } from "./advertise"

describe("advertiseFacts", () => {
  it("spells out price, budget, length and reach", () => {
    expect(
      advertiseFacts({
        price_per_thousand_kobo: { min: 100_000, max: 150_000 },
        min_budget_kobo: 200_000,
        max_days: 30,
        campuses: 1240,
        prohibited: [],
      })
    ).toEqual([
      { label: "Price", value: "₦1,000–₦1,500 per 1,000 views" },
      { label: "Smallest budget", value: "₦2,000" },
      { label: "Longest run", value: "30 days" },
      { label: "Campuses", value: "1,240 across Nigeria" },
    ])
  })
})
