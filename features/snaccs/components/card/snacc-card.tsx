import { memo, type ReactNode, type Ref } from "react"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { LinkPreviews } from "@/features/links/containers/link-previews"
import { ProfileLink } from "@/features/users/components/profile-link"
import { cn } from "@/lib/utils"
import type {
  EmbeddedSnacc,
  Snacc,
  SnaccPollOption,
  SnaccReplyTo,
} from "../../types"
import { asSnacc, isPlainResnacc } from "../../utils/resnaccs"
import { AddresseeLine, AuthorRow } from "./author-row"
import { ResnaccHeader } from "./card-labels"
import { SnaccMedia } from "./media/snacc-media"
import { QuoteCurve, QuoteRail } from "./quote/quote-connector"
import { QuotedSnacc } from "./quote/quoted-snacc"
import { QuotedTombstone } from "./quote/quoted-tombstone"
import { SnaccActions } from "./snacc-actions"
import { SnaccBody } from "./snacc-body"
import { SnaccPendingBar } from "./snacc-pending-bar"

export type SnaccActionHandlers = {
  onReact: (snacc: Snacc, emoji: string) => void
  onOpenBreakdown: (snacc: Snacc) => void
  onOpenResnaccs: (snacc: Snacc) => void
  onComment: (snacc: Snacc) => void
  onResnacc: (snacc: Snacc) => void
  onShare: (snacc: Snacc) => void
  onOpenActions: (snacc: Snacc) => void
  onOpenImages: (snacc: Snacc | EmbeddedSnacc, index: number) => void
  onVote: (snacc: Snacc, optionId: string) => void
  onOpenPollImage: (snacc: Snacc, option: SnaccPollOption) => void
  onRetry: (snacc: Snacc) => void
  onDiscard: (snacc: Snacc) => void
  onPress?: (snacc: Snacc) => void
  onPressQuote?: (quote: EmbeddedSnacc) => void
  onHoldImage?: (snacc: Snacc | EmbeddedSnacc, index: number) => void
  onKeepSticker?: (snacc: Snacc | EmbeddedSnacc) => void
}

export type SnaccCardProps = SnaccActionHandlers & {
  snacc: Snacc
  addressee?: SnaccReplyTo | null
  inset?: number
  flushTop?: boolean
  header?: ReactNode
  votingPollFor?: string | null
  itemRef?: Ref<HTMLElement>
}

function SnaccCardComponent(props: SnaccCardProps) {
  const {
    snacc,
    onReact,
    onOpenBreakdown,
    onOpenResnaccs,
    onComment,
    onResnacc,
    onShare,
    onOpenActions,
    onOpenImages,
    onVote,
    onOpenPollImage,
    onRetry,
    onDiscard,
    onPress,
    onPressQuote,
    onHoldImage,
    onKeepSticker,
    addressee,
    inset = 0,
    flushTop = false,
    header,
    votingPollFor,
    itemRef,
  } = props

  if (snacc.resnacc_of && isPlainResnacc(snacc)) {
    return (
      <SnaccCardComponent
        {...props}
        snacc={asSnacc(snacc.resnacc_of)}
        header={<ResnaccHeader author={snacc.author} />}
      />
    )
  }

  const { author } = snacc
  const pending = snacc.status !== undefined
  const clickable = !!onPress && !pending

  const avatar = snacc.anonymous ? (
    <GhostAvatar />
  ) : (
    <ProfileLink
      username={author.username}
      fromSnaccId={snacc.id}
      className="shrink-0"
    >
      <UserAvatar
        alt={author.display_name ?? "Snacc author"}
        avatarUrl={author.avatar_url}
        name={author.username}
      />
    </ProfileLink>
  )

  const media = (
    <SnaccMedia
      snacc={snacc}
      onPressImage={(index) => onOpenImages(snacc, index)}
      onHoldImage={
        onHoldImage ? (index) => onHoldImage(snacc, index) : undefined
      }
      onHoldSticker={onKeepSticker ? () => onKeepSticker(snacc) : undefined}
      poll={{
        voting: votingPollFor === snacc.id,
        onVote: (optionId) => onVote(snacc, optionId),
        onOpenImage: (option) => onOpenPollImage(snacc, option),
      }}
    />
  )

  const actions = pending ? (
    <SnaccPendingBar
      status={snacc.status!}
      onRetry={() => onRetry(snacc)}
      onDiscard={() => onDiscard(snacc)}
    />
  ) : (
    <SnaccActions
      reactions={snacc.reactions}
      reactionsCount={snacc.reactions_count}
      myReaction={snacc.my_reaction}
      commentsCount={snacc.comments_count}
      resnaccsCount={snacc.resnaccs_count}
      myResnacc={snacc.my_resnacc}
      anonymous={snacc.anonymous}
      onReact={(emoji) => onReact(snacc, emoji)}
      onOpenBreakdown={() => onOpenBreakdown(snacc)}
      onOpenResnaccs={() => onOpenResnaccs(snacc)}
      onComment={() => onComment(snacc)}
      onResnacc={() => onResnacc(snacc)}
      onShare={() => onShare(snacc)}
    />
  )

  return (
    <article
      ref={itemRef}
      onClick={clickable ? () => onPress(snacc) : undefined}
      className={cn(
        "flex flex-col gap-3 border-b border-border pr-4 pb-4",
        flushTop ? "pt-0" : "pt-4",
        clickable &&
          "cursor-pointer transition-colors hover:bg-accent/30 active:bg-accent/50",
        snacc.status === "sending" && "opacity-60"
      )}
      style={{ paddingLeft: 16 + inset }}
    >
      {header}

      <div className="flex gap-3">
        <div className="flex w-11 shrink-0 flex-col">
          {avatar}
          {snacc.resnacc_of ? <QuoteRail /> : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <AuthorRow
            snacc={snacc}
            pending={pending}
            onOpenActions={onOpenActions}
          />
          <AddresseeLine addressee={addressee} />
          <SnaccBody body={snacc.body} entities={snacc.entities} stripLinks />
          <LinkPreviews body={snacc.body} onOpenSnacc={onPressQuote} />
          {media}
          {snacc.quoted_gone ? (
            <QuotedTombstone reason={snacc.quoted_gone} />
          ) : null}
        </div>
      </div>

      {snacc.resnacc_of ? (
        <div className="-mt-3 flex gap-3">
          <div className="w-11 shrink-0">
            <QuoteCurve />
          </div>
          <div className="min-w-0 flex-1 pt-4">
            <QuotedSnacc
              snacc={snacc.resnacc_of}
              onPress={onPressQuote}
              onPressImage={(index) => onOpenImages(snacc.resnacc_of!, index)}
            />
          </div>
        </div>
      ) : null}

      <div className="pl-14">{actions}</div>
    </article>
  )
}

export const SnaccCard = memo(SnaccCardComponent)
