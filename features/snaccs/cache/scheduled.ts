import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { filterItems, mapItems } from "@/lib/query/pages"
import type { ScheduledSnacc } from "../types"
import { snaccKeys } from "../utils/keys"

type ScheduledPages = PaginatedPages<ScheduledSnacc>

const client = () => getQueryClient()

export function scheduledChanged(): void {
  void client().invalidateQueries({ queryKey: snaccKeys.scheduled() })
}

export function replaceScheduled(next: ScheduledSnacc): void {
  client().setQueryData<ScheduledPages>(snaccKeys.scheduled(), (data) =>
    mapItems(data, (item) => (item.id === next.id ? next : item))
  )
}

export function dropScheduled(id: string): void {
  client().setQueryData<ScheduledPages>(snaccKeys.scheduled(), (data) =>
    filterItems(data, (item) => item.id !== id)
  )
}
