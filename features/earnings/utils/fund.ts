import { formatMoney } from "@/lib/money"
import type { CampusFund, FundLook } from "../types"
import { progressPercent } from "./milestones"

export function fundLook(fund: CampusFund): FundLook {
  return {
    standing: fund.rank
      ? `#${fund.rank} of ${fund.earners} earners`
      : `${fund.earners} earning`,
    shared: `${formatMoney(fund.distributed)} shared`,
    cap: `of ${formatMoney(fund.cap)}`,
    percent: progressPercent(fund.distributed.amount, fund.cap.amount),
  }
}

export function snaccPreviewText(snacc: { body: string | null }): string {
  return snacc.body?.trim() || "A snacc"
}
