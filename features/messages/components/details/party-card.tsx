import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import type { MessageParty } from "../../types"
import { StreakFlame } from "../conversations/streak-flame"

export function PartyCard({
  other,
  name,
  handle,
  note,
  streak,
  profileHref,
}: {
  other: MessageParty
  name: string
  handle: string | null
  note: string | null
  streak: number
  profileHref: string | null
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <PersonAvatar person={other} className="size-24" />
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-xl font-extrabold text-foreground">
            {name}
          </h2>
          <StreakFlame days={streak} />
        </div>
        {handle ? (
          <p className="text-sm text-muted-foreground">{handle}</p>
        ) : null}
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      </div>
      {profileHref ? (
        <Button
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href={profileHref} />}
        >
          View profile
        </Button>
      ) : null}
    </div>
  )
}
