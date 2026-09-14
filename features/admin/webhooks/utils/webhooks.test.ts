import { describe, expect, it } from "vitest"
import { formatDate } from "@/lib/format"
import {
  deliveryFacts,
  deliveryLine,
  PROVIDER_OPTIONS,
  providerLabel,
  STATUS_OPTIONS,
  statusLabel,
} from "./webhooks"

describe("labels", () => {
  it("names each provider, and passes an unknown one through", () => {
    expect(providerLabel("revenuecat")).toBe("RevenueCat")
    expect(providerLabel("paystack")).toBe("Paystack")
    expect(providerLabel("stripe")).toBe("stripe")
  })

  it("calls a delivery still being handled unsettled", () => {
    expect(statusLabel("received")).toBe("Unsettled")
    expect(statusLabel("applied")).toBe("Applied")
    expect(statusLabel("queued")).toBe("queued")
  })
})

describe("options", () => {
  it("offers each provider and outcome in plain words", () => {
    expect(PROVIDER_OPTIONS).toEqual([
      { value: "revenuecat", label: "RevenueCat" },
      { value: "paystack", label: "Paystack" },
    ])
    expect(STATUS_OPTIONS.map((option) => option.label)).toEqual([
      "Applied",
      "Ignored",
      "Failed",
      "Unsettled",
    ])
  })
})

describe("deliveryFacts", () => {
  it("puts failures first, then each provider and outcome", () => {
    expect(
      deliveryFacts({
        failed: 2,
        by_provider: [
          { provider: "paystack", status: "applied", count: 1500 },
          { provider: "revenuecat", status: "failed", count: 2 },
        ],
      })
    ).toEqual([
      { label: "Failed", value: "2" },
      { label: "Paystack · Applied", value: "1,500" },
      { label: "RevenueCat · Failed", value: "2" },
    ])
  })
})

describe("deliveryLine", () => {
  it("gives the provider's event id and when it arrived", () => {
    const created_at = "2026-09-01T10:00:00Z"
    expect(deliveryLine({ event_id: "evt_1", created_at })).toBe(
      `evt_1 · received ${formatDate(created_at)}`
    )
  })
})
