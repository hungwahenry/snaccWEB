import { ChevronRightIcon, UserRoundPlusIcon } from "lucide-react"
import Link from "next/link"
import { countLabel } from "@/lib/format"

/** Sits above Notifications while anyone is waiting on you. */
export function FollowRequestsRow({
  count,
  href,
}: {
  count: number
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/40 active:opacity-70"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <UserRoundPlusIcon className="size-5 text-primary" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-extrabold text-foreground">Follow requests</span>
        <span className="text-sm text-muted-foreground">
          {countLabel(count, "person", "people")} waiting to follow you
        </span>
      </span>
      <ChevronRightIcon className="size-5 text-muted-foreground" />
    </Link>
  )
}
