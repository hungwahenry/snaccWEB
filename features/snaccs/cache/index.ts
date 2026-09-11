import type { QueryKey } from "@tanstack/react-query"
import { userKeys } from "@/features/users/utils/keys"
import type { PublicProfile } from "@/features/users/types"
import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import {
  allItems,
  appendItem,
  filterItems,
  mapItems,
  prependItem,
} from "@/lib/query/pages"
import type { QuotedGone, Snacc, SnaccReaction } from "../types"
import {
  commentSortOf,
  isCommentList,
  isSnaccDetail,
  isSnaccList,
  isUserList,
  snaccKeys,
} from "../utils/keys"
import { withSummary } from "../utils/reactions"
import { asSnacc, isPlainResnacc, toEmbedded } from "../utils/resnaccs"

type SnaccPages = PaginatedPages<Snacc>
type Snapshot = [QueryKey, unknown][]

const client = () => getQueryClient()

const inLists = {
  predicate: (query: { queryKey: QueryKey }) => isSnaccList(query.queryKey),
}

const hasMedia = (snacc: Snacc) => snacc.images.length > 0 || Boolean(snacc.gif)

function changeLists(
  change: (data: SnaccPages | undefined) => SnaccPages | undefined
): void {
  client().setQueriesData<SnaccPages>(inLists, change)
}

function bumpProfileSnaccs(
  username: string | null | undefined,
  delta: number
): void {
  if (!username) return
  client().setQueryData<PublicProfile>(
    userKeys.profile(username),
    (profile) =>
      profile && {
        ...profile,
        snaccs_count: Math.max(0, profile.snaccs_count + delta),
      }
  )
}

/** Takes a snacc out of every list; its plain resnaccs go with it and its quotes say why. */
function dropFromLists(id: string, gone: QuotedGone): void {
  changeLists((data) =>
    mapItems(
      filterItems(
        data,
        (snacc) =>
          snacc.id !== id &&
          !(snacc.resnacc_of?.id === id && isPlainResnacc(snacc))
      ),
      (snacc) =>
        snacc.resnacc_of?.id === id
          ? { ...snacc, resnacc_of: null, quoted_gone: gone }
          : snacc
    )
  )
}

export function removeSnacc(id: string): void {
  const removed = findSnacc(id)
  if (removed) bumpProfileSnaccs(removed.author.username, -1)

  client().removeQueries({ queryKey: snaccKeys.detail(id), exact: true })
  dropFromLists(id, "deleted")
}

/** Hidden, not gone: nothing is counted down and the snacc itself stays open where it is. */
export function removeHiddenSnacc(id: string): void {
  dropFromLists(id, "unavailable")
}

export function removeAuthorSnaccs(userId: string): void {
  changeLists((data) =>
    filterItems(data, (snacc) => snacc.author.id !== userId)
  )
}

export function insertSnacc(snacc: Snacc): void {
  bumpProfileSnaccs(snacc.author.username, 1)

  if (snacc.parent_id) {
    const parentId = snacc.parent_id
    for (const [key] of client().getQueriesData<SnaccPages>({
      predicate: (query) => isCommentList(query.queryKey, parentId),
    })) {
      client().setQueryData<SnaccPages>(key, (data) =>
        commentSortOf(key) === "oldest"
          ? appendItem(data, snacc)
          : prependItem(data, snacc)
      )
    }
    return
  }

  client().setQueriesData<SnaccPages>({ queryKey: snaccKeys.feeds() }, (data) =>
    prependItem(data, snacc)
  )

  const username = snacc.author.username
  if (!username) return
  const tabs = hasMedia(snacc)
    ? (["snaccs", "media"] as const)
    : (["snaccs"] as const)
  client().setQueriesData<SnaccPages>(
    { predicate: (query) => isUserList(query.queryKey, username, tabs) },
    (data) => prependItem(data, snacc)
  )
}

export function replaceSnacc(tempId: string, real: Snacc): void {
  changeLists((data) =>
    mapItems(data, (snacc) => (snacc.id === tempId ? real : snacc))
  )
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

  client().setQueryData<Snacc>(
    snaccKeys.detail(id),
    (snacc) => snacc && apply(snacc)
  )
  changeLists((data) => mapItems(data, apply))

  return previous
}

export function setPinned(authorId: string, pinnedId: string | null): void {
  const apply = (snacc: Snacc): Snacc =>
    snacc.author.id === authorId
      ? { ...snacc, pinned: snacc.id === pinnedId }
      : snacc

  changeLists((data) => mapItems(data, apply))
  client().setQueriesData<Snacc>(
    { predicate: (query) => isSnaccDetail(query.queryKey) },
    (snacc) => snacc && apply(snacc)
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

  changeLists((data) => mapItems(data, apply))
  client().setQueriesData<Snacc>(
    { predicate: (query) => isSnaccDetail(query.queryKey) },
    (snacc) => snacc && apply(snacc)
  )
}

export function patchSummary(
  id: string,
  previous: string | null,
  next: string | null
): void {
  client().setQueryData<SnaccReaction[]>(
    snaccKeys.reactionSummary(id),
    (tallies) => tallies && withSummary(tallies, previous, next)
  )
}

export function findSnacc(id: string): Snacc | undefined {
  const single = client().getQueryData<Snacc>(snaccKeys.detail(id))
  if (single) return single

  for (const [, data] of client().getQueriesData<SnaccPages>(inLists)) {
    for (const snacc of allItems(data)) {
      if (snacc.id === id) return snacc
      if (snacc.resnacc_of?.id === id) return asSnacc(snacc.resnacc_of)
    }
  }
  return undefined
}

export function snapshotSnaccs(): Snapshot {
  return client().getQueriesData({
    predicate: (query) =>
      isSnaccDetail(query.queryKey) || isSnaccList(query.queryKey),
  })
}

export function restoreSnaccs(snapshot: Snapshot): void {
  snapshot.forEach(([key, data]) => client().setQueryData(key, data))
}

export function cancelSnaccQueries(id: string): Promise<void> {
  return Promise.all([
    client().cancelQueries({ queryKey: snaccKeys.detail(id) }),
    client().cancelQueries(inLists),
  ]).then(() => undefined)
}

export function commentsChanged(parentId: string): void {
  void client().invalidateQueries({
    queryKey: snaccKeys.commentLists(parentId),
    refetchType: "none",
  })
  void client().invalidateQueries({ queryKey: snaccKeys.detail(parentId) })
}

export function resnaccsChanged(id: string): void {
  void client().invalidateQueries({ queryKey: snaccKeys.resnaccSummary(id) })
  void client().invalidateQueries({ queryKey: snaccKeys.resnaccers(id) })
  void client().invalidateQueries({ queryKey: snaccKeys.quotes(id) })
}

export function reactionsChanged(id: string): void {
  void client().invalidateQueries({ queryKey: snaccKeys.reactionSummary(id) })
  void client().invalidateQueries({ queryKey: snaccKeys.reactorLists(id) })
}

export function savedChanged(): void {
  void client().invalidateQueries({ queryKey: snaccKeys.bookmarks() })
}
