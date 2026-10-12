import { countLabel } from "@/lib/format"
import type { OwnPromotion } from "../types"

export function ownPromotionLabel(
  promotion: OwnPromotion,
  now: number
): string {
  switch (promotion.status) {
    case "pending":
      return "Promotion in review"
    case "paused":
      return "Promotion paused"
    case "active":
      return Date.parse(promotion.starts_at) > now
        ? "Promotion scheduled"
        : `Promoted · ${countLabel(promotion.views_count, "view")}`
  }
}
