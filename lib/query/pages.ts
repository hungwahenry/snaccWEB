import type { InfiniteData } from "@tanstack/react-query"
import type { Paginated } from "../api/types"

type Pages<T, P> = InfiniteData<Paginated<T>, P> | undefined

export function allItems<T, P>(data: Pages<T, P>): T[] {
  return data?.pages.flatMap((page) => page.items) ?? []
}

export function findItem<T, P>(
  data: Pages<T, P>,
  match: (item: T) => boolean
): T | undefined {
  for (const page of data?.pages ?? []) {
    const found = page.items.find(match)
    if (found) return found
  }
  return undefined
}

export function mapItems<T, P>(
  data: Pages<T, P>,
  change: (item: T) => T
): Pages<T, P> {
  return (
    data && {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.map(change),
      })),
    }
  )
}

export function filterItems<T, P>(
  data: Pages<T, P>,
  keep: (item: T) => boolean
): Pages<T, P> {
  return (
    data && {
      ...data,
      pages: data.pages.map((page) => {
        const items = page.items.filter(keep)
        return {
          ...page,
          items,
          total: Math.max(0, page.total - (page.items.length - items.length)),
        }
      }),
    }
  )
}

export function prependItem<T, P>(data: Pages<T, P>, item: T): Pages<T, P> {
  return (
    data && {
      ...data,
      pages: data.pages.map((page, index) => ({
        ...page,
        total: page.total + 1,
        items: index === 0 ? [item, ...page.items] : page.items,
      })),
    }
  )
}

export function appendItem<T, P>(data: Pages<T, P>, item: T): Pages<T, P> {
  return (
    data && {
      ...data,
      pages: data.pages.map((page, index) => ({
        ...page,
        total: page.total + 1,
        items:
          index === data.pages.length - 1 ? [...page.items, item] : page.items,
      })),
    }
  )
}

export function firstPageOnly<T, P>(data: Pages<T, P>): Pages<T, P> {
  return (
    data && {
      pages: data.pages.slice(0, 1),
      pageParams: data.pageParams.slice(0, 1),
    }
  )
}

function idOf(item: unknown): string | null {
  if (item && typeof item === "object" && "id" in item) {
    const id = (item as { id: unknown }).id
    if (typeof id === "string") return id
  }
  return null
}

/** Drops the repeats paging produces when a list shifts between two page loads. */
export function uniqueById<T>(items: T[]): T[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    const id = idOf(item)
    if (id === null) return true
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}
