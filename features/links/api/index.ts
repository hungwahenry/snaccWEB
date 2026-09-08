import { api } from "@/lib/api/client"
import type { ShareRef } from "@/lib/share-links"
import type { ResolvedLink } from "@/features/links/types"

export function resolveLinks(links: ShareRef[]): Promise<ResolvedLink[]> {
  return api.post<ResolvedLink[]>("/links/resolve", { links })
}
