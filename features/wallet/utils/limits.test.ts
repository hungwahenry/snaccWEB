import { describe, expect, it } from "vitest"
import { railLine, railLines, tierCopy } from "./limits"

describe("railLine", () => {
  it("reads usage against the limit", () => {
    expect(railLine("send", { limit: 1000000, used: 250000 })).toEqual({
      rail: "send",
      label: "Send to people",
      usage: "₦2,500 of ₦10,000",
      percent: 25,
    })
  })

  it("caps the bar at full and copes with no limit", () => {
    expect(railLine("deposit", { limit: 100, used: 500 }).percent).toBe(100)
    expect(railLine("deposit", { limit: 0, used: 0 }).percent).toBe(0)
  })
})

describe("railLines", () => {
  it("lists every rail in a steady order", () => {
    const lines = railLines({
      tier: "basic",
      send: { limit: 1, used: 0 },
      bank_send: { limit: 1, used: 0 },
      deposit: { limit: 1, used: 0 },
    })
    expect(lines.map((line) => line.rail)).toEqual([
      "send",
      "bank_send",
      "deposit",
    ])
  })
})

describe("tierCopy", () => {
  it("offers verifying only on basic with account numbers on", () => {
    expect(tierCopy("basic", true).canVerify).toBe(true)
    expect(tierCopy("basic", false).canVerify).toBe(false)
    expect(tierCopy("verified", true)).toMatchObject({
      title: "Verified",
      canVerify: false,
    })
  })
})
