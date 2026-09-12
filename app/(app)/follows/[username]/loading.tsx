"use client"

import { useParams, useSearchParams } from "next/navigation"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FollowUserRowSkeleton } from "@/features/follows/components/follow-user-row-skeleton"
import type { FollowTab } from "@/features/follows/types"
import { FOLLOW_TABS } from "@/features/follows/utils/tabs"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

const ignore = () => {}

export default function Loading() {
  const { username } = useParams<{ username: string }>()
  const tab: FollowTab =
    useSearchParams().get("tab") === "following" ? "following" : "followers"

  return (
    <>
      <RouteBackHeader title={`@${username}`} />
      <PillTabs tabs={FOLLOW_TABS} value={tab} onChange={ignore} />
      <SkeletonRows count={8} item={FollowUserRowSkeleton} />
    </>
  )
}
