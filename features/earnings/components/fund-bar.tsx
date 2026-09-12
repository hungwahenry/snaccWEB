import type { CampusFund } from "../types"
import { EARNINGS_COPY } from "../utils/earnings-copy"
import { fundLook } from "../utils/fund"

export function FundBar({ fund }: { fund: CampusFund }) {
  const look = fundLook(fund)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-bold text-foreground">
          {EARNINGS_COPY.fund}
        </span>
        <span className="text-sm text-muted-foreground">{look.standing}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${look.percent}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{look.shared}</span>
        <span>{look.cap}</span>
      </div>
    </div>
  )
}
