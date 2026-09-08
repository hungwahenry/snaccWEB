import type { Paginated } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query-client"
import { FEED_KEY } from "@/lib/query-keys"
import type { InfiniteData, QueryKey } from "@tanstack/react-query"
import type { Snacc, SnaccReaction } from "../types"
import { withSummary } from "../utils/reactions"
import { asSnacc, toEmbedded } from "../utils/resnaccs"

type SnaccPages = InfiniteData<Paginated<Snacc>>
type Snapshot = [QueryKey, unknown][]

const isFeed = (key: QueryKey) => key[0] === "feed"
const isComments = (key: QueryKey) =>
  key[0] === "snaccs" && key[2] === "comments"
const isUserSnaccs = (key: QueryKey) =>
  key[0] === "users" && key[1] === "snaccs"
const isBookmarks = (key: QueryKey) => key[0] === "bookmarks"
const isHashtagSnaccs = (key: QueryKey) =>
  key[0] === "hashtags" && key[2] === "snaccs"
const isSearchSnaccs = (key: QueryKey) =>
  key[0] === "search" && key[1] === "snaccs"
const isCampusSnaccs = (key: QueryKey) =>
  key[0] === "universities" && key[2] === "snaccs"
const isResnaccQuotes = (key: QueryKey) =>
  key[0] === "snaccs" && key[2] === "resnaccs" && key[3] === "quotes"

const isSnaccList = (key: QueryKey) =>
  isFeed(key) ||
  isComments(key) ||
  isUserSnaccs(key) ||
  isBookmarks(key) ||
  isHashtagSnaccs(key) ||
  isSearchSnaccs(key) ||
  isCampusSnaccs(key) ||
  isResnaccQuotes(key)

const client = () => getQueryClient()

const snaccLists = () =>
  client().getQueriesData<SnaccPages>({
    predicate: (query) => isSnaccList(query.queryKey),
  })

const hasMedia = (snacc: Snacc) => snacc.images.length > 0 || Boolean(snacc.gif)

const mapPages = (apply: (snacc: Snacc) => Snacc) => (data?: SnaccPages) =>
  data && {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map(apply),
    })),
  }

function setLists(update: (data?: SnaccPages) => SnaccPages | undefined) {
  client().setQueriesData<SnaccPages>(
    { predicate: (query) => isSnaccList(query.queryKey) },
    update
  )
}

export function removeSnacc(id: string): void {
  const removed = client().getQueryData<Snacc>(["snaccs", id])
  if (removed) bumpProfileSnaccs(removed.author.username, -1)

  const gone = (snacc: Snacc) => snacc.id === id || snacc.resnacc_of?.id === id

  client().removeQueries({ queryKey: ["snaccs", id], exact: true })
  setLists(
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter((snacc) => !gone(snacc)),
          total: Math.max(0, page.total - page.items.filter(gone).length),
        })),
      }
  )
}

export function removeAuthorSnaccs(userId: string): void {
  setLists(
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => {
          const kept = page.items.filter((snacc) => snacc.author.id !== userId)
          return {
            ...page,
            items: kept,
            total: Math.max(0, page.total - (page.items.length - kept.length)),
          }
        }),
      }
  )
}

const prepend = (snacc: Snacc) => (data?: SnaccPages) =>
  data && {
    ...data,
    pages: data.pages.map((page, index) => ({
      ...page,
      total: page.total + 1,
      items: index === 0 ? [snacc, ...page.items] : page.items,
    })),
  }

const append = (snacc: Snacc) => (data?: SnaccPages) =>
  data && {
    ...data,
    pages: data.pages.map((page, index) => ({
      ...page,
      total: page.total + 1,
      items:
        index === data.pages.length - 1 ? [...page.items, snacc] : page.items,
    })),
  }

function bumpProfileSnaccs(
  username: string | null | undefined,
  delta: number
): void {
  const key = username?.toLowerCase()
  if (!key) return
  client().setQueryData<{ snaccs_count: number } & Record<string, unknown>>(
    ["users", "profile", key],
    (profile) =>
      profile
        ? {
            ...profile,
            snaccs_count: Math.max(0, (profile.snaccs_count ?? 0) + delta),
          }
        : profile
  )
}

function insertIntoProfile(snacc: Snacc, tabs: readonly string[]): void {
  const username = snacc.author.username?.toLowerCase()
  if (!username) return

  client().setQueriesData<SnaccPages>(
    {
      predicate: (query) =>
        isUserSnaccs(query.queryKey) &&
        query.queryKey[2] === username &&
        tabs.includes(query.queryKey[3] as string),
    },
    prepend(snacc)
  )
}

export function insertSnacc(snacc: Snacc): void {
  bumpProfileSnaccs(snacc.author.username, 1)

  if (snacc.parent_id) {
    const lists = client().getQueriesData<SnaccPages>({
      predicate: (query) =>
        isComments(query.queryKey) && query.queryKey[1] === snacc.parent_id,
    })
    for (const [key] of lists) {
      client().setQueryData<SnaccPages>(
        key,
        key[3] === "oldest" ? append(snacc) : prepend(snacc)
      )
    }
    return
  }

  client().setQueriesData<SnaccPages>({ queryKey: FEED_KEY }, prepend(snacc))
  insertIntoProfile(snacc, hasMedia(snacc) ? ["snaccs", "media"] : ["snaccs"])
}

export function replaceSnacc(tempId: string, real: Snacc): void {
  setLists(mapPages((snacc) => (snacc.id === tempId ? real : snacc)))
}

export function patchSnacc(
  id: string,
  patch: (snacc: Snacc) => Snacc
): Snacc | undefined {
  let previous: Snacc | undefined

  const apply = (snacc: Snacc): Snacc => {
    if (snacc.id === id) {
      previous ??= snacc
      return patch(snacc)
    }
    if (snacc.resnacc_of?.id === id) {
      previous ??= asSnacc(snacc.resnacc_of)
      return {
        ...snacc,
        resnacc_of: toEmbedded(patch(asSnacc(snacc.resnacc_of))),
      }
    }
    return snacc
  }

  client().setQueryData<Snacc>(["snaccs", id], (snacc) => snacc && apply(snacc))
  setLists(mapPages(apply))

  return previous
}

export function setPinned(authorId: string, pinnedId: string | null): void {
  setLists(
    mapPages((snacc) =>
      snacc.author.id === authorId
        ? { ...snacc, pinned: snacc.id === pinnedId }
        : snacc
    )
  )
}

export function setAuthorTier(authorId: string, tier: string | null): void {
  const apply = (snacc: Snacc): Snacc =>
    snacc.author.id === authorId
      ? {
          ...snacc,
          author: { ...snacc.author, score: { ...snacc.author.score, tier } },
        }
      : snacc

  setLists(mapPages(apply))
  client().setQueriesData<Snacc>(
    {
      predicate: (query) =>
        query.queryKey[0] === "snaccs" && query.queryKey.length === 2,
    },
    (snacc) => snacc && apply(snacc)
  )
}

export function patchSummary(
  id: string,
  previous: string | null,
  next: string | null
): void {
  client().setQueryData<SnaccReaction[]>(
    ["snaccs", id, "reactions", "summary"],
    (tallies) => tallies && withSummary(tallies, previous, next)
  )
}

export function findSnacc(id: string): Snacc | undefined {
  const single = client().getQueryData<Snacc>(["snaccs", id])
  if (single) return single

  for (const [, data] of snaccLists()) {
    for (const snacc of data?.pages.flatMap((page) => page.items) ?? []) {
      if (snacc.id === id) return snacc
      if (snacc.resnacc_of?.id === id) return asSnacc(snacc.resnacc_of)
    }
  }
  return undefined
}

export function snapshotSnaccs(): Snapshot {
  return client().getQueriesData({
    predicate: (query) =>
      query.queryKey[0] === "snaccs" || isSnaccList(query.queryKey),
  })
}

export function restoreSnaccs(snapshot: Snapshot): void {
  snapshot.forEach(([key, data]) => client().setQueryData(key, data))
}
