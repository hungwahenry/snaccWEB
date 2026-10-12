import { describe, expect, it } from "vitest"
import { estimateOf, viewsFor } from "./estimate"

describe("viewsFor", () => {
  it("is the budget over the price, times a thousand", () => {
    expect(viewsFor(500_000, 100_000)).toBe(5000)
    expect(viewsFor(250_000, 150_000)).toBe(1666)
  })

  it("is nothing without a budget or a price", () => {
    expect(viewsFor(0, 100_000)).toBe(0)
    expect(viewsFor(500_000, 0)).toBe(0)
  })
})

describe("estimateOf", () => {
  it("gives one price and one count when the price is the same everywhere", () => {
    const estimate = estimateOf(
      { people: 1200, price_per_thousand_kobo: { min: 100_000, max: 100_000 } },
      500_000
    )
    expect(estimate.people).toBe("Reaches about 1,200 people")
    expect(estimate.price).toBe("₦1,000 per 1,000 views")
    expect(estimate.views).toBe("About 5,000 views")
  })

  it("gives a range, fewest views at the dearest price", () => {
    const estimate = estimateOf(
      { people: 1, price_per_thousand_kobo: { min: 100_000, max: 200_000 } },
      400_000
    )
    expect(estimate.people).toBe("Reaches about 1 person")
    expect(estimate.price).toBe("₦1,000–₦2,000 per 1,000 views")
    expect(estimate.views).toBe("About 2,000–4,000 views")
  })

  it("leaves views out until there is a budget", () => {
    const estimate = estimateOf(
      { people: 50, price_per_thousand_kobo: { min: 100_000, max: 100_000 } },
      0
    )
    expect(estimate.views).toBeNull()
  })
})
