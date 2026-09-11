import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** A small labelled pill for something a reply or quote carries: a poll, a voice note, a match. */
export function ContextChip({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 self-start rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  )
}
