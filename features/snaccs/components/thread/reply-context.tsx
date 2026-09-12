import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { LinkPreviews } from "@/features/links/containers/link-previews"
import { TierName } from "@/features/users/components/flair"
import { ProfileLink } from "@/features/users/components/profile-link"
import { nameOf } from "@/features/users/utils/names"
import type { GlimpsedSnacc } from "../../types"
import { AuthorMeta } from "../card/author-meta"
import { SnaccMedia } from "../card/media/snacc-media"
import type { PollViewProps } from "../card/poll-view"
import { QuotedSnacc } from "../card/quote/quoted-snacc"
import { SnaccBody } from "../card/snacc-body"
import { ThreadConnector } from "./thread-connector"

type ReplyContextProps = {
  snacc: GlimpsedSnacc
  onPress?: () => void
  onPressImage?: (index: number) => void
  poll?: Omit<PollViewProps, "poll" | "disabled">
}

/**
 * The snacc being answered, sat above the answer with a thread line running down to it. Shown at
 * full size, as a post reads, so the two read as one conversation.
 */
export function ReplyContext({
  snacc,
  onPress,
  onPressImage,
  poll,
}: ReplyContextProps) {
  const { author } = snacc

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
              alt={nameOf(author)}
              avatarUrl={author.avatar_url}
              name={author.username}
            />
          </ProfileLink>
        )}
        <ThreadConnector className="min-h-6" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-4">
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

        <SnaccBody body={snacc.body} entities={snacc.entities} stripLinks />
        <LinkPreviews body={snacc.body} />
        <SnaccMedia snacc={snacc} onPressImage={onPressImage} poll={poll} />
        {snacc.resnacc_of ? <QuotedSnacc snacc={snacc.resnacc_of} /> : null}
      </div>
    </div>
  )
}
