import type { FeedScope } from "@/features/feed/types"
import type { Snacc } from "@/features/snaccs/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"

export function listClips(
  scope: FeedScope,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>("/feed/clips", { scope, page })
}
