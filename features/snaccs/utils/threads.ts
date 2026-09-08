import type { Snacc, SnaccReplyTo } from "../types"

export function addresseeOf(
  reply: Snacc,
  underAuthorId: string | undefined
): SnaccReplyTo | null {
  if (!reply.reply_to_user) return null
  if (reply.reply_to_user.id === underAuthorId) return null
  return reply.reply_to_user
}
