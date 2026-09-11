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
  const campus = room.campus !== null
  const Icon = campus ? SchoolIcon : GlobeIcon

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        small ? "size-8" : "size-12",
        campus ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
      )}
    >
      <Icon className={small ? "size-4" : "size-6"} />
    </span>
  )
}
