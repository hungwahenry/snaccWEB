import { CheckIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { NamedIcon } from "@/lib/icons/named-icon"
import { cn } from "@/lib/utils"
import type { ScoreStanding, ScoreTier } from "../types"
import { ProgressGradient } from "./progress-gradient"

export type LadderRung = ScoreTier & { reached: boolean; current: boolean }

export function ScoreLadder({
  standing,
  ladder,
}: {
  standing: ScoreStanding
  ladder: LadderRung[]
}) {
  const tier = standing.tier
  const next = standing.next

  return (
    <div className="flex flex-col gap-8 px-6 py-6">
      <div className="flex flex-col items-center gap-3">
        <p className="text-6xl font-extrabold text-foreground tabular-nums">
          {Math.round(standing.score).toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          {tier?.icon ? (
            <NamedIcon name={tier.icon} color={tier.color} size={22} />
          ) : null}
          <p
            className="text-2xl font-extrabold text-foreground"
            style={tier?.color ? { color: tier.color } : undefined}
          >
            {tier?.label ?? "Fresher"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ProgressGradient
          progress={standing.progress}
          from={tier?.color ?? ""}
          to={next?.color ?? ""}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{tier?.label ?? "Fresher"}</span>
          <span>
            {next
              ? `${(next.min_score - standing.score).toLocaleString()} to ${next.label || next.key}`
              : "Top of the ladder"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Eyebrow>The ladder</Eyebrow>
        <div className="flex flex-col gap-1">
          {ladder.map((rung) => (
            <div
              key={rung.key}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5",
                rung.current && "bg-muted"
              )}
            >
              <span className="flex w-6 justify-center">
                {rung.icon ? (
                  <NamedIcon
                    name={rung.icon}
                    color={rung.reached ? rung.color : undefined}
                    size={18}
                  />
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground/40" />
                )}
              </span>
              <span
                className={cn(
                  "flex-1 text-base font-bold",
                  rung.reached ? "text-foreground" : "text-muted-foreground"
                )}
                style={
                  rung.reached && rung.color ? { color: rung.color } : undefined
                }
              >
                {rung.label || rung.key}
              </span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {rung.min_score === 0
                  ? "Start"
                  : rung.min_score.toLocaleString()}
              </span>
              {rung.reached ? (
                <CheckIcon className="size-4 text-foreground" />
              ) : (
                <span className="size-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
