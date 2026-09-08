"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { useFlag } from "@/features/config/hooks/use-flag"
import { formatNaira } from "@/lib/format"
import { useLimits } from "../../hooks/account/use-limits"
import { RECEIVE_PATH } from "../../routes"
import type { RailUsage } from "../../types"

export function LimitsPanel() {
  const limits = useLimits()
  const accountNumberEnabled = useFlag("wallet_dva")

  if (limits.isError) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load your limits"
          onRetry={() => void limits.refetch()}
        />
      </div>
    )
  }
  if (!limits.data) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }

  const verified = limits.data.tier === "verified"

  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col gap-1">
        <Eyebrow>Your tier</Eyebrow>
        <p className="text-2xl font-extrabold text-foreground">
          {verified ? "Verified" : "Basic"}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          {verified
            ? "Your identity is confirmed, so you get the higher daily limits."
            : accountNumberEnabled
              ? "Open your account number to confirm your identity and raise every limit below."
              : "These are the daily limits on a basic account."}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Rail label="Send to people" usage={limits.data.send} />
        <Rail label="Send to banks" usage={limits.data.bank_send} />
        <Rail label="Add money" usage={limits.data.deposit} />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Limits roll over 24 hours after each move, not at midnight.
      </p>

      {!verified && accountNumberEnabled ? (
        <Button
          size="lg"
          className="h-14 text-base"
          render={<Link href={RECEIVE_PATH} />}
        >
          Verify to raise your limits
        </Button>
      ) : null}
    </div>
  )
}

function Rail({ label, usage }: { label: string; usage: RailUsage }) {
  const fraction = usage.limit > 0 ? Math.min(1, usage.used / usage.limit) : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-bold text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatNaira(usage.used)} of {formatNaira(usage.limit)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}
