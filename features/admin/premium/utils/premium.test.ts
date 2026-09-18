import { describe, expect, it } from "vitest"
import { longDate } from "@/lib/format"
import type { PremiumStats } from "../types"
import {
  BENEFIT_LIMITS,
  benefitDraft,
  benefitMessage,
  premiumFacts,
  subscriberStore,
  storeLabel,
  subscriberStanding,
  toBenefitInput,
  untilLabel,
} from "./premium"

describe("subscriberStanding", () => {
  it("calls a live subscription active or cancelling by whether it renews", () => {
    expect(
      subscriberStanding({ active: true, lifetime: false, will_renew: true })
        .label
    ).toBe("Active")
    expect(
      subscriberStanding({ active: true, lifetime: false, will_renew: false })
        .label
    ).toBe("Cancelling")
  })

  it("never calls a lifetime purchase cancelling, though it does not renew", () => {
    expect(
      subscriberStanding({ active: true, lifetime: true, will_renew: false })
        .label
    ).toBe("Lifetime")
  })

  it("calls anything no longer live lapsed", () => {
    const lapsed = subscriberStanding({
      active: false,
      lifetime: false,
      will_renew: true,
    })
    expect(lapsed).toEqual({ label: "Lapsed", variant: "outline" })
  })
})

describe("untilLabel", () => {
  it("says never when there is no end date", () => {
    expect(untilLabel(null)).toBe("Never")
    expect(untilLabel("2026-10-01T00:00:00Z")).toBe(
      longDate("2026-10-01T00:00:00Z")
    )
  })
})

describe("storeLabel", () => {
  it("names each store, and passes an unknown one through", () => {
    expect(storeLabel("app_store")).toBe("App Store")
    expect(storeLabel("promotional")).toBe("Granted")
    expect(storeLabel("amazon")).toBe("amazon")
  })
})

describe("premiumFacts", () => {
  const stats: PremiumStats = {
    active: 1200,
    lapsed: 3,
    cancelling: 4,
    lifetime: 2,
    sandbox: 7,
    by_store: [
      { store: "play_store", count: 900 },
      { store: "promotional", count: 5 },
    ],
  }

  it("lists how people stand, lifetime included", () => {
    expect(premiumFacts(stats).standing).toEqual([
      { label: "Active", value: "1,200" },
      { label: "Cancelling", value: "4" },
      { label: "Lapsed", value: "3" },
      { label: "Lifetime", value: "2" },
      { label: "Sandbox, not revenue", value: "7" },
    ])
  })

  it("marks a sandbox purchase beside its store", () => {
    expect(subscriberStore({ store: "app_store", sandbox: true })).toBe(
      "App Store · sandbox"
    )
    expect(subscriberStore({ store: "play_store", sandbox: false })).toBe(
      "Play Store"
    )
  })

  it("lists each store by name", () => {
    expect(premiumFacts(stats).stores).toEqual([
      { label: "Play Store", value: "900" },
      { label: "Granted", value: "5" },
    ])
  })
})

describe("benefit drafts", () => {
  const ready = { label: "No ads", description: "Scroll without a single ad." }

  it("starts from the saved wording", () => {
    expect(benefitDraft({ ...ready, label: "Badge" })).toEqual({
      ...ready,
      label: "Badge",
    })
  })

  it("trims what is saved", () => {
    expect(
      toBenefitInput({ label: " No ads ", description: " Gone. " })
    ).toEqual({ label: "No ads", description: "Gone." })
  })

  it("refuses a blank or overlong line", () => {
    expect(toBenefitInput({ ...ready, label: "  " })).toBeNull()
    expect(toBenefitInput({ ...ready, description: "" })).toBeNull()
    expect(
      toBenefitInput({
        ...ready,
        label: "x".repeat(BENEFIT_LIMITS.label + 1),
      })
    ).toBeNull()
    expect(
      toBenefitInput({
        ...ready,
        description: "x".repeat(BENEFIT_LIMITS.description + 1),
      })
    ).toBeNull()
  })
})

describe("benefitMessage", () => {
  it("says what changed", () => {
    expect(benefitMessage({ enabled: true })).toBe("Shown on the paywall.")
    expect(benefitMessage({ enabled: false })).toBe("Hidden from the paywall.")
    expect(benefitMessage({ label: "No ads" })).toBe("Paywall line saved.")
  })
})
