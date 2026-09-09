import { InsightsSkeleton } from "@/features/insights/components/insights-skeleton"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <div className="p-5">
        <InsightsSkeleton />
      </div>
    </>
  )
}
