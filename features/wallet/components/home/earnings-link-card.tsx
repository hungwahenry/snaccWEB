import { ChevronRightIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { EARNINGS_PATH } from "../../routes"

export function EarningsLinkCard({ line }: { line: string }) {
  return (
    <Link
      href={EARNINGS_PATH}
      className="flex items-center gap-3 py-1 transition-transform active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <SparklesIcon className="size-5 text-foreground" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-bold text-foreground">Monetisation</span>
        <span className="truncate text-sm text-muted-foreground">{line}</span>
      </span>
      <ChevronRightIcon className="size-5 text-muted-foreground" />
    </Link>
  )
}
