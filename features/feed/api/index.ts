import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Snacc } from "@/features/snaccs/types"
import type { FeedScope } from "../types"

export function listFeed(
  scope: FeedScope,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>("/feed", { scope, page })
}
