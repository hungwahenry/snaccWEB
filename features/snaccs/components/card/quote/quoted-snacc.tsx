import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { ProfileLink } from "@/features/users/components/profile-link"
import { cn } from "@/lib/utils"
import type { EmbeddedSnacc } from "../../../types"
import { AuthorMeta } from "../author-meta"
import { SnaccMedia } from "../media/snacc-media"
import { SnaccBody } from "../snacc-body"
import { nameOf } from "@/features/users/utils/names"

type QuotedSnaccProps = {
  snacc: EmbeddedSnacc
  onPress?: (snacc: EmbeddedSnacc) => void
  onPressImage?: (index: number) => void
  frameless?: boolean
}

export function QuotedSnacc({
  snacc,
  onPress,
  onPressImage,
  frameless,
}: QuotedSnaccProps) {
  const { author } = snacc

  return (
    <div
      role={onPress ? "link" : undefined}
      tabIndex={onPress ? 0 : undefined}
      onClick={
        onPress
          ? (event) => {
              event.stopPropagation()
              onPress(snacc)
            }
          : undefined
      }
      onKeyDown={
        onPress
          ? (event) => {
              if (event.key === "Enter") onPress(snacc)
            }
          : undefined
      }
      className={cn(
        "flex flex-col gap-2 overflow-hidden p-3",
        !frameless && "rounded-2xl border border-border",
        onPress && "cursor-pointer transition-colors hover:bg-accent/40"
      )}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        {snacc.anonymous ? (
          <span className="flex min-w-0 shrink items-center gap-1.5">
            <GhostAvatar className="size-5" iconClassName="size-3" />
            <span className="truncate text-sm font-bold text-foreground">
              Ghost
            </span>
          </span>
        ) : (
          <ProfileLink
            username={author.username}
            className="flex min-w-0 shrink items-center gap-1.5 hover:underline"
          >
            <UserAvatar
              alt={nameOf(author)}
              avatarUrl={author.avatar_url}
              name={author.username}
              className="size-5"
              textClassName="text-[10px]"
            />
            <TierName
              score={author.score}
              official={author.official}
              birthday={author.is_birthday}
              name={author.username}
              className="text-sm font-bold text-foreground"
              iconSize={14}
            />
          </ProfileLink>
        )}
        <AuthorMeta
          university={author.university}
          createdAt={snacc.created_at}
          editedAt={snacc.edited_at}
        />
      </div>

      <SnaccBody
        body={snacc.body}
        entities={snacc.entities}
        className="text-sm leading-5"
      />
      <SnaccMedia snacc={snacc} onPressImage={onPressImage} />
    </div>
  )
}
