import type { Snacc } from "@/features/snaccs/types"
import type { PromotionLink } from "../types"

export const PREVIEW_CAMPAIGN_ID = "preview"

export function promotedPreview(
  snacc: Snacc,
  button: PromotionLink | null
): Snacc {
  return {
    ...snacc,
    promoted: { campaign_id: PREVIEW_CAMPAIGN_ID, button },
  }
}
