import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Spinner } from "@/components/ui/spinner"
import { formatNaira } from "@/lib/format"
import type { CampusFund, EarningsMilestone, TopSnacc } from "../types"
import { EARNINGS_COPY } from "../utils/earnings-copy"
import { snaccPreviewText } from "../utils/fund"
import { FundBar } from "./fund-bar"
import { MilestoneList } from "./milestone-list"

export function EarningsSummary({
  balance,
  milestones,
  claim,
  fund,
  topSnaccs,
}: {
  balance: string
  milestones: EarningsMilestone[]
  claim: { label: string; busy: boolean; onClaim: () => void } | null
  fund: CampusFund | null
  topSnaccs: TopSnacc[]
}) {
  return (
    <div className="flex flex-col gap-6 px-6 pt-8">
      <div className="flex flex-col items-center gap-1.5">
        <Eyebrow>{EARNINGS_COPY.eyebrow}</Eyebrow>
        <p className="truncate text-center text-6xl font-extrabold text-foreground tabular-nums">
          {balance}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          {EARNINGS_COPY.caption}
        </p>
      </div>

      {claim ? (
        <Button
          size="lg"
          className="h-14 text-base"
          disabled={claim.busy}
          onClick={claim.onClaim}
        >
          {claim.busy ? (
            <Spinner />
          ) : (
            <>
              <SparklesIcon /> {claim.label}
            </>
          )}
        </Button>
      ) : (
        <MilestoneList milestones={milestones} />
      )}

      {fund ? <FundBar fund={fund} /> : null}

      {topSnaccs.length > 0 ? (
        <div className="flex flex-col gap-3">
          <Eyebrow>{EARNINGS_COPY.top}</Eyebrow>
          {topSnaccs.map((row, index) => (
            <div key={row.snacc.id} className="flex items-center gap-3">
              <span className="w-5 text-lg font-extrabold text-muted-foreground">
                {index + 1}
              </span>
              <span className="flex-1 truncate text-sm text-foreground">
                {snaccPreviewText(row.snacc)}
              </span>
              <span className="text-sm font-extrabold text-foreground tabular-nums">
                {formatNaira(row.total)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SparklesIcon}
          title="No earning snaccs yet"
          description="Post snaccs people love — every reaction pays."
          className="py-10"
        />
      )}
    </div>
  )
}
