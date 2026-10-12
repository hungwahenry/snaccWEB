import { describe, expect, it } from "vitest"
import type { Snacc } from "@/features/snaccs/types"
import { PREVIEW_CAMPAIGN_ID, promotedPreview } from "./preview"

describe("promotedPreview", () => {
  it("dresses the snacc the way the feed will show it", () => {
    const snacc = { id: "s1", body: "party friday" } as Snacc
    const button = { label: "Book now", url: "https://a.example" }

    expect(promotedPreview(snacc, button)).toMatchObject({
      id: "s1",
      promoted: { campaign_id: PREVIEW_CAMPAIGN_ID, button },
    })
    expect(promotedPreview(snacc, null).promoted?.button).toBeNull()
  })
})
