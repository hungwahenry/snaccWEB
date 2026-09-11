import { FootprintsIcon } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { compactCount } from "@/lib/format"
import { VISITORS_PATH } from "../routes"
import { visitorsButtonLabel } from "../utils/visitors"

export function VisitorsButton({
  count,
  loading,
}: {
  count: number
  loading: boolean
}) {
  return (
    <Link
      href={VISITORS_PATH}
      aria-label={visitorsButtonLabel(count)}
      className="relative flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent active:opacity-70"
    >
      <FootprintsIcon className="size-5" />

      {loading ? (
        <Skeleton className="absolute -top-1 -right-1 size-4 rounded-full" />
      ) : count > 0 ? (
        <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {compactCount(count)}
        </span>
      ) : null}
    </Link>
  )
}
