"use client"

import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query"
import { useMemo, useState } from "react"
import type { Paginated, PaginatedPages } from "@/lib/api/types"
import {
  allItems,
  FIRST_PAGE,
  firstPageOnly,
  nextPage,
  uniqueById,
} from "@/lib/query/pages"

interface InfiniteListOptions {
  enabled?: boolean
  keepPrevious?: boolean
}

export function useInfiniteList<T>(
  queryKey: QueryKey,
  fetchPage: (page: number, snapshot?: string) => Promise<Paginated<T>>,
  options: InfiniteListOptions = {}
) {
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam.page, pageParam.snapshot),
    initialPageParam: FIRST_PAGE,
    enabled: options.enabled,
    placeholderData:
      options.keepPrevious === false ? undefined : keepPreviousData,
    getNextPageParam: nextPage,
  })

  async function refresh() {
    setRefreshing(true)
    queryClient.setQueryData<PaginatedPages<T>>(queryKey, firstPageOnly)
    try {
      await query.refetch()
    } finally {
      setRefreshing(false)
    }
  }

  const items = useMemo(() => uniqueById(allItems(query.data)), [query.data])

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
