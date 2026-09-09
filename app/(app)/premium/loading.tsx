import { PremiumSkeleton } from "@/features/premium/components/premium-skeleton"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <PremiumSkeleton />
    </>
  )
}
