import { chatRoomPath } from "@/features/chats/routes"
import { conversationPath } from "@/features/messages/routes"
import { snaccPath } from "@/features/snaccs/routes"
import { stickerPackPath } from "@/features/stickers/routes"
import { profilePath } from "@/features/users/routes"
import { handleOf } from "@/features/users/utils/names"
import type { MyReportTarget, ReportSubject, ReportTarget } from "../types"

export function reportSubject(target: MyReportTarget): ReportSubject {
  switch (target.type) {
    case "snacc":
      return {
        person: target.snacc.author,
        what: target.snacc.body || "A snacc",
        href: snaccPath(target.snacc.id),
      }
    case "moment":
      return {
        person: target.user,
        what: `A moment by ${handleOf(target.user) ?? "someone"}`,
        href: profilePath(target.user.username),
      }
    case "message":
      return {
        person: target.user,
        what: "A message in your DMs",
        href: conversationPath(target.message.conversation_id),
      }
    case "chat_message":
      return {
        person: target.user,
        what: `A message by ${handleOf(target.user) ?? "someone"} in a room`,
        href: chatRoomPath(target.chat_message.room_id),
      }
    case "user":
      return {
        person: target.user,
        what: handleOf(target.user) ?? "An account",
        href: profilePath(target.user.username),
      }
    case "sticker_pack":
      return {
        person: target.user,
        what: `The sticker pack “${target.sticker_pack.title}”`,
        href: stickerPackPath(target.sticker_pack.id),
      }
  }
}

export function reportTitle(target: ReportTarget | null): string {
  if (!target) return "Report"
  switch (target.type) {
    case "user":
      return target.username
        ? `Report @${target.username}`
        : "Report this person"
    case "moment":
      return "Report this moment"
    case "message":
    case "chat_message":
      return "Report this message"
    case "snacc":
      return "Report this snacc"
    case "sticker_pack":
      return "Report this sticker pack"
  }
}
