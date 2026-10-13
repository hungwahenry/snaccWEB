import { describe, expect, it } from "vitest"
import { money } from "@/lib/money"
import type { AdsInfo } from "../types"
import { advertisePricing, advertiseQuestions } from "./advertise"

const naira = (amount: number) => money(amount, "NGN")

const info: AdsInfo = {
  prices: [
    {
      price_per_thousand: { min: naira(100_000), max: naira(100_000) },
      min_budget: naira(200_000),
    },
  ],
  max_days: 30,
  campuses: 429,
  prohibited: ["Alcohol", "Weapons"],
}

describe("advertisePricing", () => {
  it("leads with the smallest budget and what it buys", () => {
    expect(advertisePricing(info)).toEqual({
      start: "₦2,000",
      views: "2,000",
      rate: "₦1,000 per 1,000 views",
    })
  })

  it("says the rate depends on the campus when prices differ", () => {
    expect(
      advertisePricing({
        ...info,
        prices: [
          {
            price_per_thousand: { min: naira(100_000), max: naira(200_000) },
            min_budget: naira(200_000),
          },
        ],
      }).rate
    ).toBe("₦1,000–₦2,000 per 1,000 views, depending on the campus")
  })

  it("names each currency's start, and no single view count, when there are several", () => {
    expect(
      advertisePricing({
        ...info,
        prices: [
          ...info.prices,
          {
            price_per_thousand: {
              min: money(1_000, "GHS"),
              max: money(1_000, "GHS"),
            },
            min_budget: money(2_000, "GHS"),
          },
        ],
      })
    ).toMatchObject({ start: "₦2,000 or GH₵20", views: null })
  })
})

describe("advertiseQuestions", () => {
  it("answers with the live budget and policy", () => {
    const questions = advertiseQuestions(info)
    expect(
      questions.find((item) => item.q === "How much does it cost?")?.a
    ).toMatch(/starting from ₦2,000/)
    expect(questions.find((item) => item.q.includes("can't promote"))?.a).toBe(
      "Yes. We don't take promotions for: Alcohol, Weapons."
    )
  })

  it("leaves out the policy question when nothing is listed", () => {
    expect(
      advertiseQuestions({ ...info, prohibited: [] }).some((item) =>
        item.q.includes("can't promote")
      )
    ).toBe(false)
  })
})
