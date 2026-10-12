import type { Snacc } from "@/features/snaccs/types"
import type { Paginated } from "@/lib/api/types"
import type { PromotedSnacc } from "../types"

export function slotPage(snacc: PromotedSnacc | null): Paginated<Snacc> {
  const items = snacc ? [snacc] : []
  return {
    items,
    page: 1,
    last_page: 1,
    per_page: 1,
    total: items.length,
  }
}
