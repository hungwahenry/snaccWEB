import {
  CheckIcon,
  ChevronRightIcon,
  LockIcon,
  MapPinIcon,
  MessageCircleIcon,
  MessagesSquareIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { HangoutBlockState } from "../../hooks/block/use-hangout-block"
import type { SnaccHangout } from "../../types"
import type { JoinButton } from "../../utils/join"
import { HangoutDetail } from "./hangout-detail"

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
        <HangoutDetail icon={MapPinIcon} muted={block.placeHidden}>
          {block.place}
        </HangoutDetail>
        <HangoutDetail icon={UsersIcon}>{block.going}</HangoutDetail>
        {hangout.private ? (
          <HangoutDetail icon={LockIcon}>
            The host approves who joins
          </HangoutDetail>
        ) : null}
      </div>

      {block.live ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <JoinAction
              button={block.button}
              disabled={disabled}
              onJoin={block.onJoin}
            />
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
          </div>

          {linkToSnaccs ? (
            <div className="-mx-3.5 flex items-center justify-between gap-2 border-t border-border px-3.5 pt-2.5">
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
              {block.postHref && !disabled ? (
                <Link
                  href={block.postHref}
                  aria-label="Post from this hangout"
                  title="Post from this hangout"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
                >
                  <PlusIcon className="size-4" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
