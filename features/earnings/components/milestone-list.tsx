import { CircleCheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EarningsMilestone } from "../types"
import { clearedLabel, milestoneLook } from "../utils/milestones"

export function MilestoneList({
  milestones,
}: {
  milestones: EarningsMilestone[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <span className="text-lg font-extrabold text-foreground">
          Milestones
        </span>
        <span className="text-sm font-bold text-muted-foreground">
          {clearedLabel(milestones)}
        </span>
      </div>
      {milestones.map((milestone) => (
        <MilestoneBar key={milestone.key} milestone={milestone} />
      ))}
    </div>
  )
}

function MilestoneBar({ milestone }: { milestone: EarningsMilestone }) {
  const look = milestoneLook(milestone)

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          milestone.met ? "bg-success/15" : "bg-muted"
        )}
      >
        <look.icon
          className={cn(
            "size-5",
            milestone.met ? "text-success" : "text-muted-foreground"
          )}
        />
      </span>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{look.label}</span>
          {milestone.met ? (
            <CircleCheckIcon className="size-5 text-success" />
          ) : (
            <span className="text-sm text-muted-foreground tabular-nums">
              {look.progress}
            </span>
          )}
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              milestone.met ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${look.percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
