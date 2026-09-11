import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/** An icon-only link that looks like an IconButton, for header actions that go somewhere. */
export function HeaderLink({
  href,
  icon: Icon,
  label,
  className,
}: {
  href: string
  icon: LucideIcon
  label: string
  className?: string
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/30 active:scale-95",
        className
      )}
    >
      <Icon className="size-6" />
    </Link>
  )
}
