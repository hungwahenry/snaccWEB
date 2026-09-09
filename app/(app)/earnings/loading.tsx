import { EarningsSkeleton } from "@/features/earnings/components/earnings-skeleton"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <EarningsSkeleton />
    </>
  )
}
