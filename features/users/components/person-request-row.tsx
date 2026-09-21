import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { Author } from "../types"
import { profilePath } from "../routes"
import { nameOf } from "../utils/names"
import { personLines } from "../utils/profile"
import { TierName } from "./flair"

export function PersonRequestRow({
  person,
  onAccept,
  onDecline,
  leadWithUsername = false,
}: {
  person: Author
  onAccept: (person: Author) => void
  onDecline: (person: Author) => void
  leadWithUsername?: boolean
}) {
  const href = profilePath(person.username)
  const lines = personLines(person, leadWithUsername)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={href} className="shrink-0">
        <UserAvatar
          alt={nameOf(person)}
          avatarUrl={person.avatar_url}
          name={person.username}
        />
      </Link>

      <Link href={href} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <TierName
            score={person.score}
            official={person.official}
            birthday={person.is_birthday}
            name={lines.name}
            className="truncate font-extrabold text-foreground"
          />
        </span>
        {lines.detail ? (
          <span className="block truncate text-sm text-muted-foreground">
            {lines.detail}
          </span>
        ) : null}
      </Link>

      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="sm" onClick={() => onDecline(person)}>
          Decline
        </Button>
        <Button size="sm" onClick={() => onAccept(person)}>
          Accept
        </Button>
      </div>
    </div>
  )
}
