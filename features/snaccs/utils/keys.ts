import type { QueryKey } from "@tanstack/react-query"
import type { FeedScope } from "@/features/feed/types"
import type { ProfileTab } from "@/features/users/types"
import type { CommentSort } from "../types"

const LIST = "snacc-list"

export const snaccKeys = {
  detail: (id: string) => ["snaccs", "detail", id] as const,
  reactionSummary: (id: string) => ["snaccs", "reaction-summary", id] as const,
  reactorLists: (id: string) => ["snaccs", "reactors", id] as const,
  reactors: (id: string, emoji: string | null) =>
    ["snaccs", "reactors", id, emoji] as const,
  resnaccSummary: (id: string) => ["snaccs", "resnacc-summary", id] as const,
  resnaccers: (id: string) => ["snaccs", "resnaccers", id] as const,
  drafts: () => ["snaccs", "drafts"] as const,
  scheduled: () => ["snaccs", "scheduled"] as const,

  lists: () => [LIST] as const,
  feeds: () => [LIST, "feed"] as const,
  feed: (scope: FeedScope) => [LIST, "feed", scope] as const,
  userLists: (username: string) =>
    [LIST, "user", username.toLowerCase()] as const,
  user: (username: string, tab: ProfileTab) =>
    [LIST, "user", username.toLowerCase(), tab] as const,
  bookmarks: () => [LIST, "bookmarks"] as const,
  hashtag: (tag: string) => [LIST, "hashtag", tag.toLowerCase()] as const,
  cashtag: (symbol: string) => [LIST, "cashtag", symbol.toUpperCase()] as const,
  search: (q: string) => [LIST, "search", q] as const,
  campus: (slug: string) => [LIST, "campus", slug.toLowerCase()] as const,
  match: (matchId: string) => [LIST, "match", matchId] as const,
  hangout: (snaccId: string) => [LIST, "hangout", snaccId] as const,
  clipLists: () => [LIST, "clips"] as const,
  clips: (scope: FeedScope) => [LIST, "clips", scope] as const,
  commentLists: (snaccId: string) => [LIST, "comments", snaccId] as const,
  comments: (snaccId: string, sort: CommentSort) =>
    [LIST, "comments", snaccId, sort] as const,
  quotes: (snaccId: string) => [LIST, "quotes", snaccId] as const,
}

export const scheduledMutationKeys = {
  publish: () => ["snaccs", "publish-scheduled"] as const,
  remove: () => ["snaccs", "delete-scheduled"] as const,
}

export const isSnaccList = (key: QueryKey) => key[0] === LIST

export const isSnaccDetail = (key: QueryKey) =>
  key[0] === "snaccs" && key[1] === "detail"

export const isCommentList = (key: QueryKey, snaccId: string) =>
  key[0] === LIST && key[1] === "comments" && key[2] === snaccId

export const commentSortOf = (key: QueryKey) =>
  key[0] === LIST && key[1] === "comments"
    ? (key[3] as CommentSort | undefined)
    : undefined

export const isUserList = (
  key: QueryKey,
  username: string,
  tabs: readonly ProfileTab[]
) =>
  key[0] === LIST &&
  key[1] === "user" &&
  key[2] === username.toLowerCase() &&
  tabs.includes(key[3] as ProfileTab)
