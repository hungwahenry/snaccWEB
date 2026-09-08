import { CornerDownRightIcon, EllipsisIcon } from "lucide-react"
import { OgBadge, TierName } from "@/features/users/components/flair"
import { ProfileLink } from "@/features/users/components/profile-link"
import type { Snacc, SnaccReplyTo } from "../../types"
import { AuthorMeta } from "./author-meta"

export function AuthorRow({
  snacc,
  pending,
  onOpenActions,
}: {
  snacc: Snacc
  pending: boolean
  onOpenActions: (snacc: Snacc) => void
}) {
  const { author } = snacc

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      {snacc.anonymous ? (
        <span className="shrink truncate font-extrabold text-foreground">
          Ghost
        </span>
      ) : (
        <ProfileLink
          username={author.username}
          fromSnaccId={snacc.id}
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

      {!snacc.anonymous ? <OgBadge score={author.score} /> : null}

      <AuthorMeta
        university={author.university}
        createdAt={snacc.created_at}
        editedAt={snacc.edited_at}
      />

      {pending ? null : (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onOpenActions(snacc)
          }}
          aria-label="More"
          className="-my-1 -mr-2 ml-auto flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <EllipsisIcon className="size-5" />
        </button>
      )}
    </div>
  )
}

export function AddresseeLine({
  addressee,
}: {
  addressee: SnaccReplyTo | null | undefined
}) {
  if (!addressee) return null

  return (
    <div className="flex items-center gap-1">
      <CornerDownRightIcon className="size-3.5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">to</span>
      {addressee.anonymous ? (
        <span className="text-sm font-bold text-foreground">Ghost</span>
      ) : (
        <ProfileLink
          username={addressee.username}
          className="shrink truncate text-sm font-bold text-foreground hover:underline"
        >
          @{addressee.username ?? "someone"}
        </ProfileLink>
      )}
    </div>
  )
}
