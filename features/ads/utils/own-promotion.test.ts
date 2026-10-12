import { describe, expect, it } from "vitest"
import type { OwnPromotion } from "../types"
import { ownPromotionLabel } from "./own-promotion"

const NOW = Date.parse("2026-10-12T12:00:00Z")

const own = (patch: Partial<OwnPromotion>): OwnPromotion => ({
  campaign_id: "c1",
  status: "active",
  views_count: 1240,
  starts_at: "2026-10-11T12:00:00Z",
  ...patch,
})

describe("ownPromotionLabel", () => {
  it("tells the owner where their promotion stands", () => {
    expect(ownPromotionLabel(own({}), NOW)).toMatch(
      /^Promoted · 1\.2K? views$/i
    )
    expect(ownPromotionLabel(own({ status: "pending" }), NOW)).toBe(
      "Promotion in review"
    )
    expect(ownPromotionLabel(own({ status: "paused" }), NOW)).toBe(
      "Promotion paused"
    )
    expect(
      ownPromotionLabel(own({ starts_at: "2026-10-13T12:00:00Z" }), NOW)
    ).toBe("Promotion scheduled")
  })
})
