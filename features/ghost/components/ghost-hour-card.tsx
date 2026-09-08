import { GhostIcon } from "lucide-react"
import Link from "next/link"
import { composePath } from "@/features/snaccs/routes"
import { cn } from "@/lib/utils"

export function GhostHourCard({
  active,
  subtitle,
}: {
  active: boolean
  subtitle: string
}) {
  const body = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <GhostIcon className="size-5 text-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold text-foreground">Ghost Hour</span>
        <span className="block text-sm text-muted-foreground">{subtitle}</span>
      </span>
      {active ? (
        <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background">
          Post
        </span>
      ) : null}
    </>
  )

  const className = cn(
    "flex items-center gap-3 rounded-2xl border-2 border-dashed border-muted-foreground/40 p-4",
    active && "transition-opacity hover:opacity-80"
  )

  if (!active) return <div className={className}>{body}</div>

  return (
    <Link href={composePath()} className={className}>
      {body}
    </Link>
  )
}
