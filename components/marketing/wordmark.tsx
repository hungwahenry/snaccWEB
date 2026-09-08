import Link from "next/link"
import { cn } from "@/lib/utils"

export function Wordmark({
  className,
  href = "/",
  height = 24,
}: {
  className?: string
  href?: string
  height?: number
}) {
  return (
    <Link
      href={href}
      aria-label="Snacc"
      className={cn(
        "flex items-center gap-2 text-xl font-bold tracking-tight",
        className
      )}
    >
      <img
        src="/1.png"
        alt="Snacc"
        style={{ height }}
        className="w-auto dark:hidden"
      />
      <img
        src="/2.png"
        alt="Snacc"
        style={{ height }}
        className="hidden w-auto dark:block"
      />
    </Link>
  )
}
