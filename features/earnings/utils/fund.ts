import { formatNaira } from "@/lib/format"
import type { CampusFund, FundLook } from "../types"
import { progressPercent } from "./milestones"

export function fundLook(fund: CampusFund): FundLook {
  return {
    standing: fund.rank
      ? `#${fund.rank} of ${fund.earners} earners`
      : `${fund.earners} earning`,
    shared: `${formatNaira(fund.distributed)} shared`,
    cap: `of ${formatNaira(fund.cap)}`,
    percent: progressPercent(fund.distributed, fund.cap),
  }
}

export function snaccPreviewText(snacc: { body: string | null }): string {
  return snacc.body?.trim() || "A snacc"
}
