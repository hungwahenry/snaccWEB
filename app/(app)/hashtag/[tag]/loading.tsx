"use client"

import { useParams } from "next/navigation"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { hashtagLabel, tagFromParam } from "@/features/hashtags/utils/labels"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"

export default function Loading() {
  const { tag } = useParams<{ tag: string }>()

  return (
    <>
      <RouteBackHeader title={hashtagLabel(tagFromParam(tag))} />
      <SkeletonRows count={6} item={SnaccCardSkeleton} />
    </>
  )
}
