import Link from "next/link"
import { cn } from "@/lib/utils"

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-xl font-bold tracking-tight", className)}
    >
      {/* Snacc mark — black on light, white on dark */}
      <img src="/logo-light.png" alt="" className="size-6 dark:hidden" />
      <img src="/logo-dark.png" alt="" className="hidden size-6 dark:block" />
      <span>
        snacc
      </span>
    </Link>
  )
}
