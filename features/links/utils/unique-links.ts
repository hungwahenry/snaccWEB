import { findShareLinks, type ShareRef } from "@/lib/share-links"

const SHOWN = 2

export function uniqueShareLinks(body: string | null | undefined): ShareRef[] {
  if (!body) return []

  const seen = new Set<string>()
  const links: ShareRef[] = []

  for (const { kind, ref } of findShareLinks(body)) {
    const key = `${kind}:${ref}`
    if (seen.has(key)) continue
    seen.add(key)
    links.push({ kind, ref })
    if (links.length === SHOWN) break
  }

  return links
}
