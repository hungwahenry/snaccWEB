import { UserAvatar } from "@/components/ui/user-avatar"
import type { Snacc } from "../../types"
import { SnaccGlimpse } from "../thread/snacc-glimpse"
import { ThreadConnector } from "../thread/thread-connector"
import { nameOf } from "@/features/users/utils/names"

export function ReplyTo({ snacc }: { snacc: Snacc }) {
  const { author } = snacc

  return (
    <div className="flex gap-3">
      <div className="flex w-12 shrink-0 flex-col items-center">
        <UserAvatar
          alt={nameOf(author)}
          avatarUrl={author.avatar_url}
          name={author.username}
        />
        <ThreadConnector />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-4">
        <span className="truncate font-extrabold text-foreground">
          {nameOf(author)}
        </span>
        <SnaccGlimpse snacc={snacc} />
      </div>
    </div>
  )
}
