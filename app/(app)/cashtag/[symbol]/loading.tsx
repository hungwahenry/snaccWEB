"use client"

import { useParams } from "next/navigation"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { CashtagHeaderSkeleton } from "@/features/cashtags/components/cashtag-header-skeleton"
import { cashtagLabel, symbolFromParam } from "@/features/cashtags/utils/labels"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"

export default function Loading() {
  const { symbol } = useParams<{ symbol: string }>()

  return (
    <>
      <RouteBackHeader title={cashtagLabel(symbolFromParam(symbol))} />
      <CashtagHeaderSkeleton />
      <SkeletonRows count={6} item={SnaccCardSkeleton} />
    </>
  )
}
