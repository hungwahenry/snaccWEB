import { describe, expect, it } from "vitest"
import { standingLine, walletPlanTerms } from "./plan-copy"

describe("walletPlanTerms", () => {
  it("prices a month plainly", () => {
    const terms = walletPlanTerms({
      plan: "monthly",
      days: 30,
      price_kobo: 350000,
    })

    expect(terms).toMatchObject({
      title: "Monthly",
      per: "month",
      length: "30 days",
      perMonth: null,
    })
    expect(terms.price).toBe("₦3,500")
  })

  it("breaks a year down to whole naira a month", () => {
    const terms = walletPlanTerms({
      plan: "yearly",
      days: 365,
      price_kobo: 3200000,
    })

    expect(terms.per).toBe("year")
    expect(terms.perMonth).toBe("₦2,667 a month")
  })
})

describe("standingLine", () => {
  const base = { active: true, lifetime: false, until: null, will_renew: false }

  it("asks someone without Premium to back Snacc", () => {
    expect(standingLine({ ...base, active: false })).toMatch(/no ads/)
  })

  it("tells a lifetime holder there is nothing to renew", () => {
    expect(standingLine({ ...base, lifetime: true })).toBe(
      "Yours for life. Nothing to renew."
    )
  })

  it("says whether Premium renews or stops", () => {
    const until = "2026-11-07T12:00:00.000Z"

    expect(standingLine({ ...base, until, will_renew: true })).toMatch(
      /^Renews /
    )
    expect(standingLine({ ...base, until })).toMatch(/, then stops\.$/)
  })
})
