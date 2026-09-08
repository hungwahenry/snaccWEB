"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import type { ShareRef } from "@/lib/share-links"
import { resolveLinks } from "@/features/links/api"
import type { LinkTarget } from "@/features/links/types"

export const linkKey = (link: ShareRef) => ["link", link.kind, link.ref]

export function useResolvedLink(link: ShareRef): {
  target: LinkTarget | null
  loading: boolean
} {
  const query = useQuery({
    queryKey: linkKey(link),
    queryFn: () => resolveLinks([link]),
    staleTime: 5 * MINUTE_MS,
    retry: false,
  })

  return { target: query.data?.[0]?.target ?? null, loading: query.isPending }
}
