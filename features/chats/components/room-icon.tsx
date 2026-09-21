import { GlobeIcon, SchoolIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatRoom } from "../types"

export function RoomIcon({
  room,
  small = false,
}: {
  room: ChatRoom
  small?: boolean
}) {
  const campus = room.kind === "campus"
  const tinted = campus || room.kind === "hangout"
  const Icon = campus ? SchoolIcon : GlobeIcon

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        small ? "size-8" : "size-12",
        tinted ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
      )}
    >
      {room.hangout ? (
        <span className={small ? "text-base" : "text-2xl"} aria-hidden>
          {room.hangout.emoji}
        </span>
      ) : (
        <Icon className={small ? "size-4" : "size-6"} />
      )}
    </span>
  )
}
