import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import type { FeedScope } from "../types"

type FeedTabsProps = {
  tabs: PillTab<FeedScope>[]
  value: FeedScope
  onChange: (scope: FeedScope) => void
  onReselect?: (scope: FeedScope) => void
}

export function FeedTabs({ tabs, value, onChange, onReselect }: FeedTabsProps) {
  return (
    <div className="sticky top-[calc(var(--now-playing-height)+3.5rem)] z-20 bg-background/90 backdrop-blur md:top-(--now-playing-height)">
      <PillTabs
        tabs={tabs}
        value={value}
        onChange={onChange}
        onReselect={onReselect}
      />
    </div>
  )
}
