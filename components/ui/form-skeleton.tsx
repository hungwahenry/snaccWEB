import { Skeleton } from "@/components/ui/skeleton"

/// The shape every composer and settings form shares: a bar, some fields, an action.
export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <div className="flex flex-col gap-5 px-4 py-6 sm:px-6">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </>
  )
}
