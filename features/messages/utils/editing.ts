import { editWindowClosesAt } from "@/lib/format"
import type { Message } from "../types"

export function canEditMessage(
  message: Message,
  windowMinutes: number,
  now = Date.now()
): boolean {
  if (!message.mine || message.removed) return false
  if (windowMinutes <= 0) return false
  return now < editWindowClosesAt(message.created_at, windowMinutes)
}

export function canDeleteMessage(message: Message): boolean {
  return message.mine && !message.removed
}

export function canActOnMessage(message: Message): boolean {
  return message.status === undefined && !message.removed
}
