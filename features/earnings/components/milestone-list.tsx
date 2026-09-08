import {
  BanknoteIcon,
  CalendarDaysIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  EyeIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import { compactCount, formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { WalletMilestone } from "../types"

const MILESTONE_META: Record<
  string,
  { label: string; icon: LucideIcon; money?: boolean }
> = {
  balance: { label: "Minimum earnings", icon: BanknoteIcon, money: true },
  views: { label: "Total views", icon: EyeIcon },
  followers: { label: "Followers", icon: UsersRoundIcon },
  account_age_days: { label: "Days on Snacc", icon: CalendarDaysIcon },
}

export function MilestoneList({
  milestones,
}: {
  milestones: WalletMilestone[]
}) {
  const cleared = milestones.filter((milestone) => milestone.met).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <span className="text-lg font-extrabold text-foreground">
          Milestones
        </span>
        <span className="text-sm font-bold text-muted-foreground">
          {cleared} of {milestones.length} cleared
        </span>
      </div>
      {milestones.map((milestone) => (
        <MilestoneBar key={milestone.key} milestone={milestone} />
      ))}
    </div>
  )
}

function MilestoneBar({ milestone }: { milestone: WalletMilestone }) {
  const meta = MILESTONE_META[milestone.key] ?? {
    label: milestone.key,
    icon: CircleDashedIcon,
  }
  const format = (value: number) =>
    meta.money ? formatNaira(value) : compactCount(value)
  const percent =
    milestone.target > 0
      ? Math.min(100, Math.round((milestone.current / milestone.target) * 100))
      : 0

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          milestone.met ? "bg-emerald-500/15" : "bg-muted"
        )}
      >
        <meta.icon
          className={cn(
            "size-5",
            milestone.met ? "text-emerald-500" : "text-muted-foreground"
          )}
        />
      </span>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{meta.label}</span>
          {milestone.met ? (
            <CircleCheckIcon className="size-5 text-emerald-500" />
          ) : (
            <span className="text-sm text-muted-foreground">
              {format(milestone.current)} / {format(milestone.target)}
            </span>
          )}
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              milestone.met ? "bg-emerald-500" : "bg-primary"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
