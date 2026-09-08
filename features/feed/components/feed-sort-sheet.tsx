import { CheckIcon, ClockIcon, FlameIcon, type LucideIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { cn } from "@/lib/utils"
import type { FeedSort } from "../types"

const OPTIONS: {
  value: FeedSort
  label: string
  hint: string
  icon: LucideIcon
}[] = [
  {
    value: "top",
    label: "Top",
    hint: "What people are reading",
    icon: FlameIcon,
  },
  {
    value: "latest",
    label: "Latest",
    hint: "Everything, newest first",
    icon: ClockIcon,
  },
]

export function FeedSortSheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: FeedSort
  onSelect: (sort: FeedSort) => void
}) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Sort the feed">
      {OPTIONS.map((option) => {
        const active = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/60",
              active && "bg-accent/40"
            )}
          >
            <Icon
              className={cn(
                "size-4",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            />
            <span className="flex-1">
              <span
                className={cn(
                  "block text-sm text-foreground",
                  active && "font-extrabold"
                )}
              >
                {option.label}
              </span>
              <span className="block text-xs text-muted-foreground">
                {option.hint}
              </span>
            </span>
            {active ? <CheckIcon className="size-4 text-foreground" /> : null}
          </button>
        )
      })}
    </ActionSheet>
  )
}
