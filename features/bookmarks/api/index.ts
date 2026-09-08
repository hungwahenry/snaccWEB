import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Snacc } from "@/features/snaccs/types"

export async function saveSnacc(snaccId: string): Promise<void> {
  await api.post("/bookmarks", { snaccId })
}

export async function unsaveSnacc(snaccId: string): Promise<void> {
  await api.del(`/bookmarks/${snaccId}`)
}

export function listBookmarks(page: number): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>("/bookmarks", { page })
}
