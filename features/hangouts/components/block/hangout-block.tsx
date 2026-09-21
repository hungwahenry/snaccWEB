import {
  CheckIcon,
  ChevronRightIcon,
  LockIcon,
  MapPinIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  PencilIcon,
  PlusIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { badgeCount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { HangoutBlockState } from "../../hooks/block/use-hangout-block"
import type { SnaccHangout } from "../../types"
import type { JoinButton } from "../../utils/join"

function Detail({
  icon: Icon,
  muted = false,
  children,
}: {
  icon: LucideIcon
  muted?: boolean
  children: ReactNode
}) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span
        className={cn(
          "min-w-0 truncate",
          muted ? "text-muted-foreground italic" : "text-foreground"
        )}
      >
        {children}
      </span>
    </span>
  )
}

function JoinAction({
  button,
  disabled,
  onJoin,
}: {
  button: JoinButton
  disabled: boolean
  onJoin: () => void
}) {
  switch (button.kind) {
    case "hosting":
      return null
    case "going":
      return (
        <Button
          size="sm"
          variant="secondary"
          disabled={disabled}
          onClick={onJoin}
        >
          <CheckIcon /> Going
        </Button>
      )
    case "requested":
      return (
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={onJoin}
        >
          Asked
        </Button>
      )
    case "open":
      return (
        <Button size="sm" disabled={disabled} onClick={onJoin}>
          {button.label}
        </Button>
      )
    case "shut":
      return (
        <Button size="sm" variant="secondary" disabled>
          {button.label}
        </Button>
      )
  }
}

export function HangoutBlock({
  hangout,
  block,
  disabled = false,
  linkToSnaccs = true,
}: {
  hangout: SnaccHangout
  block: HangoutBlockState
  disabled?: boolean
  linkToSnaccs?: boolean
}) {
  return (
    <div
      onClick={block.live ? (event) => event.stopPropagation() : undefined}
      onKeyDown={block.live ? (event) => event.stopPropagation() : undefined}
      className="flex flex-col gap-3 rounded-2xl border border-border p-3.5"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-2xl"
        >
          {hangout.emoji}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="line-clamp-2 text-base font-extrabold text-foreground">
            {hangout.title}
          </span>
          <span className="text-sm text-muted-foreground">{block.when}</span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Detail icon={MapPinIcon} muted={block.placeHidden}>
          {block.place}
        </Detail>
        {block.membersHref && !disabled ? (
          <Link
            href={block.membersHref}
            className="flex items-center gap-1 self-start hover:underline"
          >
            <Detail icon={UsersIcon}>{block.going}</Detail>
            <ChevronRightIcon className="size-3.5 text-muted-foreground" />
          </Link>
        ) : (
          <Detail icon={UsersIcon}>{block.going}</Detail>
        )}
        {hangout.private ? (
          <Detail icon={LockIcon}>The host approves who joins</Detail>
        ) : null}
      </div>

      {block.live ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {block.host ? (
              <>
                {block.host.editHref && !disabled ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    nativeButton={false}
                    render={<Link href={block.host.editHref} />}
                  >
                    <PencilIcon /> Edit
                  </Button>
                ) : null}
                {block.host.requests && !disabled ? (
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={block.host.requestsHref} />}
                  >
                    Requests
                    <span className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-xs font-bold text-primary-foreground">
                      {badgeCount(block.host.requests)}
                    </span>
                  </Button>
                ) : null}
              </>
            ) : (
              <JoinAction
                button={block.button}
                disabled={disabled}
                onJoin={block.onJoin}
              />
            )}
            {block.chat ? (
              <Button
                size="sm"
                variant="outline"
                disabled={disabled || block.chat.pending}
                onClick={block.chat.onOpen}
              >
                <MessagesSquareIcon /> Chat
              </Button>
            ) : null}
            {block.postHref && !disabled ? (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                nativeButton={false}
                render={<Link href={block.postHref} />}
              >
                <PlusIcon /> Post
              </Button>
            ) : null}
          </div>

          {linkToSnaccs ? (
            <div className="-mx-3.5 border-t border-border px-3.5 pt-2.5">
              {disabled ? (
                <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <MessageCircleIcon className="size-4 shrink-0" />
                  <span className="truncate">Snaccs from this hangout</span>
                </span>
              ) : (
                <Link
                  href={block.snaccsHref}
                  className="flex w-fit max-w-full min-w-0 items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <MessageCircleIcon className="size-4 shrink-0" />
                  <span className="truncate">Snaccs from this hangout</span>
                  <ChevronRightIcon className="size-3.5 shrink-0" />
                </Link>
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
