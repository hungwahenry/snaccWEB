import Link from "next/link"
import { cn } from "@/lib/utils"

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-xl font-bold tracking-tight",
        className
      )}
    >
      {/* Snacc mark — black on light, white on dark */}
      <img src="/1.png" alt="Snacc" className="h-6 w-auto dark:hidden" />
      <img src="/2.png" alt="Snacc" className="hidden h-6 w-auto dark:block" />
    </Link>
  )
}
