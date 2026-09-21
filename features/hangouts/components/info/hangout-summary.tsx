import { LockIcon, MapPinIcon } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { Author } from "@/features/users/types"
import { ProfileLink } from "@/features/users/components/profile-link"
import { nameOf } from "@/features/users/utils/names"
import { HangoutDetail } from "../block/hangout-detail"

export function HangoutSummary({
  emoji,
  title,
  when,
  place,
  placeHidden,
  private: isPrivate,
  host,
}: {
  emoji: string
  title: string
  when: string
  place: string
  placeHidden: boolean
  private: boolean
  host: Author
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span
        aria-hidden
        className="flex size-20 items-center justify-center rounded-3xl bg-primary/15 text-5xl"
      >
        {emoji}
      </span>
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{when}</p>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-2xl border border-border p-3.5">
        <HangoutDetail icon={MapPinIcon} muted={placeHidden}>
          {place}
        </HangoutDetail>
        {isPrivate ? (
          <HangoutDetail icon={LockIcon}>
            The host approves who joins
          </HangoutDetail>
        ) : null}
        <ProfileLink
          username={host.username}
          className="flex min-w-0 items-center gap-2 self-start text-sm text-foreground hover:underline"
        >
          <UserAvatar
            alt={nameOf(host)}
            avatarUrl={host.avatar_url}
            name={host.username}
            className="size-5"
            textClassName="text-[10px]"
          />
          <span className="truncate">
            Hosted by <span className="font-bold">{nameOf(host)}</span>
          </span>
        </ProfileLink>
      </div>
    </div>
  )
}
