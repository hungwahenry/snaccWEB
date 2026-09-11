import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import type { LimitsScreenProps } from "../../hooks/account/use-limits-screen"
import { RECEIVE_PATH } from "../../routes"
import type { RailLine } from "../../utils/limits"

export function LimitsPanel({ failed, retry, tier, rails }: LimitsScreenProps) {
  if (failed) {
    return (
      <div className="py-24">
        <LoadFailed title="Could not load your limits" onRetry={retry} />
      </div>
    )
  }
  if (!tier) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col gap-1">
        <Eyebrow>Your tier</Eyebrow>
        <p className="text-2xl font-extrabold text-foreground">{tier.title}</p>
        <p className="text-sm leading-6 text-muted-foreground">
          {tier.description}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {rails.map((line) => (
          <Rail key={line.rail} line={line} />
        ))}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Limits roll over 24 hours after each move, not at midnight.
      </p>

      {tier.canVerify ? (
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

function Rail({ line }: { line: RailLine }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-bold text-foreground">{line.label}</span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {line.usage}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${line.percent}%` }}
        />
      </div>
    </div>
  )
}
