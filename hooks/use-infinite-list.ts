"use client"

import type { Paginated } from "@/lib/api/types"
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query"
import { useMemo, useState } from "react"

interface InfiniteListOptions {
  enabled?: boolean
}

function idOf(item: unknown): string | null {
  if (item && typeof item === "object" && "id" in item) {
    const id = (item as { id: unknown }).id
    if (typeof id === "string") return id
  }
  return null
}

export function useInfiniteList<T>(
  queryKey: QueryKey,
  fetchPage: (page: number) => Promise<Paginated<T>>,
  options: InfiniteListOptions = {}
) {
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    enabled: options.enabled,
    placeholderData: keepPreviousData,
    getNextPageParam: (last) =>
      last.page < last.last_page ? last.page + 1 : undefined,
  })

  async function refresh() {
    setRefreshing(true)
    queryClient.setQueryData<InfiniteData<Paginated<T>, number>>(
      queryKey,
      (data) =>
        data && {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        }
    )
    try {
      await query.refetch()
    } finally {
      setRefreshing(false)
    }
  }

  const items = useMemo(() => {
    const flat = query.data?.pages.flatMap((page) => page.items) ?? []
    const seen = new Set<string>()

    return flat.filter((item) => {
      const id = idOf(item)
      if (id === null) return true
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }, [query.data])

  return {
    items,
    total: query.data?.pages.at(-1)?.total,
    loading: query.isLoading,
    stale: query.isPlaceholderData,
    failed: query.isError,
    error: query.error,
    retry: () => void query.refetch(),
    refreshing,
    refresh: () => void refresh(),
    loadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        void query.fetchNextPage()
      }
    },
  }
}
