import { describe, expect, it } from "vitest"
import type { PromotedSnacc } from "../types"
import { slotPage } from "./discover"

describe("slotPage", () => {
  it("holds the one promoted snacc, or nothing", () => {
    const promoted = {
      id: "01SNACC",
      promoted: { campaign_id: "01CAMPAIGN", button: null },
    } as PromotedSnacc

    expect(slotPage(promoted)).toMatchObject({ items: [promoted], total: 1 })
    expect(slotPage(null)).toMatchObject({ items: [], total: 0, last_page: 1 })
  })
})
