"use client"

import { PillTabs } from "@/components/ui/pill-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ProfileTab } from "../types"
import { DEFAULT_PROFILE_TAB, PROFILE_TABS } from "../utils/profile-tabs"

const STAT_LABELS = ["w-10", "w-8", "w-13", "w-13"]

export function ProfileHeaderSkeleton({
  tab = DEFAULT_PROFILE_TAB,
  onTabChange = () => {},
}: {
  tab?: ProfileTab
  onTabChange?: (tab: ProfileTab) => void
}) {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-32 rounded-none sm:h-40" />
      <div className="flex flex-col gap-3 px-4 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="-mt-10 size-20 shrink-0 rounded-full ring-4 ring-background" />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-9 w-18 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <Skeleton className="my-1 h-6 w-44" />
            <Skeleton className="my-1 h-4 w-28" />
          </div>
          <Skeleton className="my-0.5 h-4 w-64 max-w-full" />
          <Skeleton className="my-[3px] h-3.5 w-40" />
        </div>

        <Skeleton className="h-7 w-24 rounded-full" />

        <div className="flex justify-between">
          {STAT_LABELS.map((width, i) => (
            <div
              key={i}
              className={cn("flex flex-col items-center", i > 1 && "px-2")}
            >
              <Skeleton className="my-1 h-4 w-8" />
              <Skeleton className={cn("my-0.5 h-3", width)} />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-14 z-20 bg-background/90 backdrop-blur">
        <PillTabs tabs={PROFILE_TABS} value={tab} onChange={onTabChange} />
      </div>
    </div>
  )
}
