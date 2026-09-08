import { GlobeIcon, GraduationCapIcon, UsersRoundIcon } from "lucide-react"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import type { FeedScope } from "../types"

const CAMPUS: PillTab<FeedScope> = {
  value: "campus",
  label: "Campus",
  icon: GraduationCapIcon,
}
const GLOBAL: PillTab<FeedScope> = {
  value: "global",
  label: "Global",
  icon: GlobeIcon,
}
const FOLLOWING: PillTab<FeedScope> = {
  value: "following",
  label: "Following",
  icon: UsersRoundIcon,
}

type FeedTabsProps = {
  value: FeedScope
  onChange: (scope: FeedScope) => void
  onReselect?: (scope: FeedScope) => void
  following?: boolean
  global?: boolean
}

export function FeedTabs({
  value,
  onChange,
  onReselect,
  following = false,
  global = true,
}: FeedTabsProps) {
  const tabs = [
    CAMPUS,
    ...(following ? [FOLLOWING] : []),
    ...(global ? [GLOBAL] : []),
  ]

  // Campus alone is not a choice, so the row of one is noise unless that pill also opens sorting.
  if (tabs.length < 2 && !onReselect) return null

  return (
    <PillTabs
      tabs={tabs}
      value={value}
      onChange={onChange}
      onReselect={onReselect}
    />
  )
}
