import { XIcon } from "lucide-react"
import Link from "next/link"
import type { HangoutTag } from "../../types"

export function HangoutTagChip({
  tag,
  href,
  onRemove,
}: {
  tag: HangoutTag
  href?: string
  onRemove?: () => void
}) {
  const label = (
    <>
      <span aria-hidden>{tag.emoji}</span>
      <span className="truncate">From {tag.title}</span>
    </>
  )

  return (
    <span className="flex max-w-full items-center self-start rounded-full bg-primary/10 text-xs font-bold text-primary">
      {href ? (
        <Link
          href={href}
          onClick={(event) => event.stopPropagation()}
          className="flex min-w-0 items-center gap-1.5 py-1 pr-2.5 pl-2.5 hover:underline"
        >
          {label}
        </Link>
      ) : (
        <span
          className="flex min-w-0 items-center gap-1.5 py-1 pl-2.5"
          style={{ paddingRight: onRemove ? 4 : 10 }}
        >
          {label}
        </span>
      )}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Don't post it from the hangout"
          className="py-1 pr-2.5 pl-1 hover:opacity-70"
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </span>
  )
}
