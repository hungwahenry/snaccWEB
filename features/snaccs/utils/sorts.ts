import type { CommentSort } from "../types"

export const COMMENT_SORTS: {
  value: CommentSort
  label: string
  hint: string
}[] = [
  {
    value: "relevant",
    label: "Relevant",
    hint: "What the thread actually engaged with",
  },
  { value: "top", label: "Most reactions", hint: "The loudest first" },
  { value: "newest", label: "Newest", hint: "Latest first" },
  { value: "oldest", label: "Oldest", hint: "Read it as a conversation" },
]

export const DEFAULT_COMMENT_SORT: CommentSort = "relevant"
export const REPLY_SORT: CommentSort = "oldest"

export function sortLabel(value: CommentSort): string {
  return COMMENT_SORTS.find((sort) => sort.value === value)?.label ?? "Relevant"
}
