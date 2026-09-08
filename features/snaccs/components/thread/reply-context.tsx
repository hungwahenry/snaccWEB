import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { ProfileLink } from "@/features/users/components/profile-link"
import type { EmbeddedSnacc } from "../../types"
import { snaccPreview } from "../../utils/preview"
import { AuthorMeta } from "../card/author-meta"
import { ThreadConnector } from "./thread-connector"

type ReplyContextProps = {
  snacc: EmbeddedSnacc
  onPress?: () => void
}

/// The post a reply hangs under, drawn small with a line running down to the reply.
export function ReplyContext({ snacc, onPress }: ReplyContextProps) {
  const { author } = snacc
  const preview = snaccPreview(snacc)

  return (
    <div
      role={onPress ? "link" : undefined}
      tabIndex={onPress ? 0 : undefined}
      onClick={onPress}
      onKeyDown={
        onPress ? (event) => event.key === "Enter" && onPress() : undefined
      }
      className="flex gap-3 px-4 pt-4 transition-colors hover:bg-accent/30 aria-disabled:cursor-default"
      style={{ cursor: onPress ? "pointer" : undefined }}
    >
      <div className="flex w-11 shrink-0 flex-col items-center">
        {snacc.anonymous ? (
          <GhostAvatar />
        ) : (
          <ProfileLink username={author.username}>
            <UserAvatar
              alt={author.display_name ?? "Author"}
              avatarUrl={author.avatar_url}
              name={author.username}
            />
          </ProfileLink>
        )}
        <ThreadConnector className="min-h-6" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pb-4">
        <div className="flex min-w-0 items-center gap-1.5">
          {snacc.anonymous ? (
            <span className="truncate font-extrabold text-foreground">
              Ghost
            </span>
          ) : (
            <ProfileLink
              username={author.username}
              className="flex min-w-0 shrink items-center gap-1.5 hover:underline"
            >
              <TierName
                score={author.score}
                official={author.official}
                birthday={author.is_birthday}
                name={author.username}
                className="font-extrabold text-foreground"
              />
            </ProfileLink>
          )}
          <AuthorMeta
            university={author.university}
            createdAt={snacc.created_at}
            linkCampus={false}
          />
        </div>

        {preview ? (
          <p className="line-clamp-4 text-sm leading-5 whitespace-pre-wrap text-foreground">
            {preview}
          </p>
        ) : null}
      </div>
    </div>
  )
}
