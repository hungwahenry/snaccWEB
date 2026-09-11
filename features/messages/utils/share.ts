import {
  findShareLinks,
  withoutShareLinks,
  type ShareKind,
} from "@/lib/share-links"

export const SHARE_LABEL: Record<ShareKind, string> = {
  snacc: "Shared a snacc",
  profile: "Shared a profile",
  campus: "Shared a campus",
  pay: "Shared a pay link",
}

/** A body's own words, with the Snacc links in it taken out, and the kind of the first link. */
export function splitShareLinks(body: string): {
  words: string | null
  link: ShareKind | null
} {
  const links = findShareLinks(body)
  if (links.length === 0) return { words: body, link: null }
  return { words: withoutShareLinks(body) || null, link: links[0].kind }
}
