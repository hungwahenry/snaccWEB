import { BuildingIcon, HandCoinsIcon } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import { campusPath } from "@/features/campus/routes"
import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { snaccPath } from "@/features/snaccs/routes"
import type { EmbeddedSnacc } from "@/features/snaccs/types"
import { TierName } from "@/features/users/components/flair"
import { profilePath } from "@/features/users/routes"
import { bareLink, shareLink, type ShareRef } from "@/lib/share-links"
import { cn } from "@/lib/utils"
import type { LinkPerson, LinkTarget } from "@/features/links/types"

const CARD = "overflow-hidden rounded-2xl border border-border bg-background"

function hrefOf(target: LinkTarget): string | null {
  if (target.kind === "snacc") return snaccPath(target.snacc.id)
  if (target.kind === "campus") return campusPath(target.slug)
  if (target.kind === "pay") return `/pay/${target.person.username ?? ""}`
  return target.person.username ? profilePath(target.person.username) : null
}

function LinkFooter({ link }: { link: ShareRef }) {
  return (
    <div className="border-t border-border px-3 py-2">
      <p className="truncate text-[11px] text-muted-foreground">
        {bareLink(shareLink[link.kind](link.ref))}
      </p>
    </div>
  )
}

function PersonRow({ person, pay }: { person: LinkPerson; pay: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <UserAvatar
        alt={person.display_name ?? "Avatar"}
        avatarUrl={person.avatar_url}
        name={person.username}
        className="size-10"
      />
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1">
          <TierName
            official={person.official}
            name={person.display_name ?? person.username}
            className="text-sm font-bold text-foreground"
            iconSize={14}
          />
        </span>
        {person.username ? (
          <p className="truncate text-xs text-muted-foreground">
            @{person.username}
          </p>
        ) : null}
      </div>
      {pay ? (
        <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-foreground">
          <HandCoinsIcon className="size-4" /> Pay
        </span>
      ) : null}
    </div>
  )
}

function CampusRow({
  target,
}: {
  target: Extract<LinkTarget, { kind: "campus" }>
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      {target.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={target.logo_url}
          alt=""
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          <BuildingIcon className="size-5 text-foreground" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">
          {target.name}
        </p>
        <p className="text-xs text-muted-foreground">{target.acronym}</p>
      </div>
    </div>
  )
}

export type LinkCardProps = {
  link: ShareRef
  target: LinkTarget | null
  loading: boolean
  onOpenSnacc?: (snacc: EmbeddedSnacc) => void
}

export function LinkCard({
  link,
  target,
  loading,
  onOpenSnacc,
}: LinkCardProps) {
  if (loading)
    return (
      <Skeleton
        className={cn(
          "w-full rounded-2xl",
          link.kind === "snacc" ? "h-32" : "h-24"
        )}
      />
    )
  if (!target) return null

  if (target.kind === "snacc") {
    return (
      <div className={CARD}>
        <QuotedSnacc frameless snacc={target.snacc} onPress={onOpenSnacc} />
        <LinkFooter link={link} />
      </div>
    )
  }

  const href = hrefOf(target)
  const body = (
    <>
      {target.kind === "campus" ? (
        <CampusRow target={target} />
      ) : (
        <PersonRow person={target.person} pay={target.kind === "pay"} />
      )}
      {target.kind === "profile" && target.bio ? (
        <p className="-mt-1 line-clamp-2 px-3 pb-3 text-xs text-muted-foreground">
          {target.bio}
        </p>
      ) : null}
      <LinkFooter link={link} />
    </>
  )

  if (!href) return <div className={CARD}>{body}</div>

  return (
    <Link
      href={href}
      onClick={(event) => event.stopPropagation()}
      className={cn(CARD, "block transition-colors hover:bg-accent/40")}
    >
      {body}
    </Link>
  )
}
