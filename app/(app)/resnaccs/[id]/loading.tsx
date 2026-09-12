"use client"

import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { resnaccTabs } from "@/features/snaccs/utils/resnacc-tabs"

const ignore = () => {}

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Resnaccs" />
      <PillTabs tabs={resnaccTabs()} value="quotes" onChange={ignore} />
      <SkeletonRows count={4} item={SnaccCardSkeleton} />
    </>
  )
}
