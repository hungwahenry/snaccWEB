import type { Snacc, SnaccReplyTo } from "../types"

export function addresseeOf(
  reply: Snacc,
  underAuthorId: string | undefined
): SnaccReplyTo | null {
  if (!reply.reply_to_user) return null
  if (reply.reply_to_user.id === underAuthorId) return null
  return reply.reply_to_user
}

/** Replies still to show: the comment's tally until opened, then the server's, which leaves out ones hidden from you. */
export function repliesLeft({
  open,
  shown,
  count,
  total,
}: {
  open: boolean
  shown: number
  count: number
  total: number | undefined
}): number {
  if (!open) return count
  return Math.max(0, (total ?? count) - shown)
}
