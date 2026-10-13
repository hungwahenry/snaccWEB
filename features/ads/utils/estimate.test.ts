import { describe, expect, it } from "vitest"
import { money } from "@/lib/money"
import { budgetPresets, estimateOf, viewsFor } from "./estimate"

const naira = (amount: number) => money(amount, "NGN")

describe("viewsFor", () => {
  it("is the budget over the price, times a thousand", () => {
    expect(viewsFor(naira(500_000), naira(100_000))).toBe(5000)
    expect(viewsFor(naira(250_000), naira(150_000))).toBe(1666)
  })

  it("is nothing without a budget or a price", () => {
    expect(viewsFor(naira(0), naira(100_000))).toBe(0)
    expect(viewsFor(naira(500_000), naira(0))).toBe(0)
  })
})

describe("estimateOf", () => {
  it("gives one price and one count when the price is the same everywhere", () => {
    const estimate = estimateOf(
      {
        people: 1200,
        price_per_thousand: { min: naira(100_000), max: naira(100_000) },
      },
      naira(500_000)
    )
    expect(estimate.people).toBe("Reaches about 1,200 people active this month")
    expect(estimate.price).toBe("₦1,000 per 1,000 views")
    expect(estimate.views).toBe("About 5,000 views")
  })

  it("gives a range, fewest views at the dearest price", () => {
    const estimate = estimateOf(
      {
        people: 1,
        price_per_thousand: { min: naira(100_000), max: naira(200_000) },
      },
      naira(400_000)
    )
    expect(estimate.people).toBe("Reaches about 1 person active this month")
    expect(estimate.price).toBe("₦1,000–₦2,000 per 1,000 views")
    expect(estimate.views).toBe("About 2,000–4,000 views")
  })

  it("leaves views out until there is a budget", () => {
    const estimate = estimateOf(
      {
        people: 50,
        price_per_thousand: { min: naira(100_000), max: naira(100_000) },
      },
      naira(0)
    )
    expect(estimate.views).toBeNull()
  })
})

describe("budgetPresets", () => {
  it("offers each preset with the views it buys", () => {
    const presets = budgetPresets([naira(200_000), naira(500_000)], {
      min: naira(100_000),
      max: naira(100_000),
    })
    expect(presets).toEqual([
      { amount: naira(200_000), label: "₦2,000", views: "About 2,000 views" },
      { amount: naira(500_000), label: "₦5,000", views: "About 5,000 views" },
    ])
  })

  it("shows the amounts alone until the price is known, and skips nothing ones", () => {
    expect(budgetPresets([naira(200_000), naira(0)], null)).toEqual([
      { amount: naira(200_000), label: "₦2,000", views: null },
    ])
  })
})
