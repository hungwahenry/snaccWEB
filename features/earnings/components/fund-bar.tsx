import { formatNaira } from "@/lib/format"
import type { CampusFund } from "../types"

export function FundBar({ fund }: { fund: CampusFund }) {
  const used = fund.cap > 0 ? Math.min(1, fund.distributed / fund.cap) : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-bold text-foreground">Campus fund</span>
        <span className="text-sm text-muted-foreground">
          {fund.rank
            ? `#${fund.rank} of ${fund.earners} earners`
            : `${fund.earners} earning`}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${used * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formatNaira(fund.distributed)} shared</span>
        <span>of {formatNaira(fund.cap)}</span>
      </div>
    </div>
  )
}
