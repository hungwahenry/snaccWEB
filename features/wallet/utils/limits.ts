import { formatNaira } from "@/lib/format"
import type { LimitRail, LimitTier, RailUsage, WalletLimits } from "../types"

const RAIL_LABELS: Record<LimitRail, string> = {
  send: "Send to people",
  bank_send: "Send to banks",
  deposit: "Add money",
}

export interface RailLine {
  rail: LimitRail
  label: string
  usage: string
  /** How much of the day's limit is used, as a percent. */
  percent: number
}

export function railLine(rail: LimitRail, usage: RailUsage): RailLine {
  return {
    rail,
    label: RAIL_LABELS[rail],
    usage: `${formatNaira(usage.used)} of ${formatNaira(usage.limit)}`,
    percent:
      usage.limit > 0 ? Math.min(100, (usage.used / usage.limit) * 100) : 0,
  }
}

export function railLines(limits: WalletLimits): RailLine[] {
  return (Object.keys(RAIL_LABELS) as LimitRail[]).map((rail) =>
    railLine(rail, limits[rail])
  )
}

export interface TierCopy {
  title: string
  description: string
  /** Whether verifying is on offer to raise the limits. */
  canVerify: boolean
}

export function tierCopy(
  tier: LimitTier,
  accountNumberEnabled: boolean
): TierCopy {
  if (tier === "verified") {
    return {
      title: "Verified",
      description:
        "Your identity is confirmed, so you get the higher daily limits.",
      canVerify: false,
    }
  }
  return accountNumberEnabled
    ? {
        title: "Basic",
        description:
          "Open your account number to confirm your identity and raise every limit below.",
        canVerify: true,
      }
    : {
        title: "Basic",
        description: "These are the daily limits on a basic account.",
        canVerify: false,
      }
}
