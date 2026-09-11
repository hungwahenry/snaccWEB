import { BellOffIcon, LockIcon } from "lucide-react"
import Link from "next/link"
import { badgeCount, timeAgo } from "@/lib/format"
import type { ChatRoom } from "../types"
import { roomSubtitle, roomTitle } from "../utils/rooms"
import { RoomIcon } from "./room-icon"

export function ChatRoomRow({ room, href }: { room: ChatRoom; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 active:opacity-70 sm:px-6"
    >
      <RoomIcon room={room} />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-base font-bold text-foreground">
            {roomTitle(room)}
          </span>
          {room.locked ? (
            <LockIcon
              className="size-3.5 text-muted-foreground"
              aria-label="Closed"
            />
          ) : null}
          {room.muted ? (
            <BellOffIcon
              className="size-3.5 text-muted-foreground"
              aria-label="Muted"
            />
          ) : null}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {roomSubtitle(room)}
        </span>
      </span>

      <span className="flex flex-col items-end gap-1">
        {room.last_message_at ? (
          <span className="text-xs text-muted-foreground">
            {timeAgo(room.last_message_at)}
          </span>
        ) : null}
        {room.unread > 0 && !room.muted ? (
          <span
            aria-label={`${room.unread} unread`}
            className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-xs font-bold text-primary-foreground"
          >
            {badgeCount(room.unread)}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
