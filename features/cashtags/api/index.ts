import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Snacc } from "@/features/snaccs/types"
import type { Cashtag } from "../types"

export function suggestCashtags(query: string): Promise<Cashtag[]> {
  return api.get<Cashtag[]>("/cashtags/suggest", { query })
}

export function getCashtag(symbol: string): Promise<Cashtag> {
  return api.get<Cashtag>(`/cashtags/${encodeURIComponent(symbol)}`)
}

export function listCashtagSnaccs(
  symbol: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(
    `/cashtags/${encodeURIComponent(symbol)}/snaccs`,
    { page }
  )
}
