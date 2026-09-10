"use client"

import Link from "next/link"
import { BellOffIcon, GlobeIcon, LockIcon, SchoolIcon } from "lucide-react"
import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ChatRoom } from "../types"

export function ChatRoomRow({ room }: { room: ChatRoom }) {
  const campus = room.campus !== null

  return (
    <Link
      href={`/chat/${room.id}`}
      className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50"
    >
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full",
          campus ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        {campus ? <SchoolIcon className="size-6" /> : <GlobeIcon className="size-6" />}
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-base font-bold">
            {campus ? room.campus?.acronym : "Everyone"}
          </span>
          {room.locked ? <LockIcon className="size-3.5 text-muted-foreground" /> : null}
          {room.muted ? <BellOffIcon className="size-3.5 text-muted-foreground" /> : null}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {campus ? room.campus?.name : "Everyone on Snacc"}
        </span>
      </span>

      <span className="flex flex-col items-end gap-1">
        {room.last_message_at ? (
          <span className="text-xs text-muted-foreground">{timeAgo(room.last_message_at)}</span>
        ) : null}
        {room.unread > 0 && !room.muted ? (
          <span className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-xs font-bold text-primary-foreground">
            {room.unread > 99 ? "99+" : room.unread}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
