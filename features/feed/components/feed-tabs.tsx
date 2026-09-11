import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import type { FeedScope } from "../types"

type FeedTabsProps = {
  tabs: PillTab<FeedScope>[]
  value: FeedScope
  onChange: (scope: FeedScope) => void
  onReselect?: (scope: FeedScope, anchor: HTMLElement) => void
}

export function FeedTabs({ tabs, value, onChange, onReselect }: FeedTabsProps) {
  return (
    <div className="sticky top-14 z-20 bg-background/90 backdrop-blur md:top-0">
      <PillTabs
        tabs={tabs}
        value={value}
        onChange={onChange}
        onReselect={onReselect}
      />
    </div>
  )
}
