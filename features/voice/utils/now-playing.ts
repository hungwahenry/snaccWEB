import { chatRoomPath } from "@/features/chats/routes"
import { conversationPath } from "@/features/messages/routes"
import { snaccPath } from "@/features/snaccs/routes"
import type { VoiceSource } from "../types"
import { clock } from "./clock"

const FULL_SCREEN = [/^\/compose\/?$/, /^\/moments\/[^/]+/]

export function hidesNowPlaying(pathname: string): boolean {
  return FULL_SCREEN.some((pattern) => pattern.test(pathname))
}

export function nowPlayingTime(positionMs: number, durationMs: number): string {
  return `${clock(Math.min(positionMs, durationMs))} / ${clock(durationMs)}`
}

export function voiceSourcePath(
  source: Pick<VoiceSource, "kind" | "id">
): string {
  switch (source.kind) {
    case "snacc":
      return snaccPath(source.id)
    case "conversation":
      return conversationPath(source.id)
    case "chat":
      return chatRoomPath(source.id)
  }
}
