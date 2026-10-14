import { describe, expect, it } from "vitest"
import {
  changeTone,
  formatChange,
  formatPrice,
  formatUsd,
  formatUsdCompact,
  localPrice,
} from "./price"

describe("formatUsdCompact", () => {
  it("shortens a market cap to trillions, billions or millions", () => {
    expect(formatUsdCompact(1_260_000_000_000)).toBe("$1.3T")
    expect(formatUsdCompact(45_200_000_000)).toBe("$45.2B")
    expect(formatUsdCompact(980_000_000)).toBe("$980M")
    expect(formatUsdCompact(150_000)).toBe("$150,000")
    expect(formatUsdCompact(null)).toBe("—")
  })
})

describe("formatUsd", () => {
  it("drops cents on big prices and keeps them on small ones", () => {
    expect(formatUsd(64123.49)).toBe("$64,123")
    expect(formatUsd(150.5)).toBe("$150.50")
    expect(formatUsd(0.000123456)).toBe("$0.000123")
    expect(formatUsd(null)).toBe("—")
  })
})

describe("formatPrice", () => {
  it("compacts the huge local prices coins carry, in that currency", () => {
    expect(formatPrice(98_400_000, "EUR")).toBe("€98.4M")
    expect(formatPrice(1_250_000_000, "EUR")).toBe("€1.3B")
    expect(formatPrice(240_000, "EUR")).toBe("€240,000")
    expect(formatPrice(12.5, "EUR")).toBe("€12.50")
    expect(formatPrice(12.5, "JPY")).toBe("¥13")
  })
})

describe("localPrice", () => {
  it("shows the viewer's own currency only where the coin is quoted in it", () => {
    const coin = { prices: [{ currency: "EUR", price: 59_000 }] }
    expect(localPrice(coin, "EUR")).toBe("€59,000")
    expect(localPrice(coin, "GBP")).toBeNull()
    expect(localPrice(coin, null)).toBeNull()
  })
})

describe("formatChange / changeTone", () => {
  it("points the arrow with the sign and names the tone", () => {
    expect(formatChange(1.55)).toBe("▲1.6%")
    expect(formatChange(-0.4)).toBe("▼0.4%")
    expect(formatChange(null)).toBe("")
    expect(changeTone(2)).toBe("up")
    expect(changeTone(-2)).toBe("down")
    expect(changeTone(0)).toBe("flat")
  })
})
