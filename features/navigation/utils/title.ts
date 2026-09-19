import { badgeCount } from "@/lib/format"

const UNREAD_PREFIX = /^\(\d+\+?\) /

export function withUnread(title: string, count: number): string {
  const plain = title.replace(UNREAD_PREFIX, "")
  return count > 0 ? `(${badgeCount(count)}) ${plain}` : plain
}
