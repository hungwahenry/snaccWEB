import { ChevronRightIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { formatNaira } from "@/lib/format"
import { EARNINGS_PATH } from "../../routes"
import type { WalletOverview } from "../../types"

export function EarningsLinkCard({
  earnings,
}: {
  earnings: WalletOverview["earnings"]
}) {
  const cleared = earnings.milestones.filter(
    (milestone) => milestone.met
  ).length

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
        <span className="truncate text-sm text-muted-foreground">
          {earnings.claimable
            ? `${formatNaira(earnings.balance)} ready to claim`
            : `${formatNaira(earnings.balance)} earned — ${cleared} of ${earnings.milestones.length} milestones`}
        </span>
      </span>
      <ChevronRightIcon className="size-5 text-muted-foreground" />
    </Link>
  )
}
