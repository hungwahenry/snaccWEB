import Link from "next/link"
import { UserAvatar } from "@/components/ui/user-avatar"
import { snaccPath } from "@/features/snaccs/routes"
import { nameOf } from "@/features/users/utils/names"
import { SnaccHangoutBlock } from "../../containers/snacc-hangout-block"
import type { HangoutCard as Card } from "../../types"
import { FriendsGoing } from "./friends-going"

export function HangoutCard({ card }: { card: Card }) {
  const { snacc } = card
  if (!snacc.hangout) return null

  return (
    <article className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:px-6">
      <Link
        href={snaccPath(snacc.id)}
        className="flex items-center gap-2 self-start hover:underline"
      >
        <UserAvatar
          alt={nameOf(snacc.author)}
          avatarUrl={snacc.author.avatar_url}
          name={snacc.author.username}
          className="size-6"
        />
        <span className="truncate text-sm font-bold text-foreground">
          {nameOf(snacc.author)}
        </span>
        <span className="text-sm text-muted-foreground">is hosting</span>
      </Link>

      <SnaccHangoutBlock
        snaccId={snacc.id}
        hangout={snacc.hangout}
        mine={snacc.mine}
      />

      <FriendsGoing
        friends={card.friends_going}
        count={card.friends_going_count}
      />
    </article>
  )
}
