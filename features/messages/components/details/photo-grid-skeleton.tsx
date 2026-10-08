import { Skeleton } from "@/components/ui/skeleton"

export function PhotoGridSkeleton({ count }: { count: number }) {
  return (
    <div aria-hidden className="grid grid-cols-3 gap-1.5">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="aspect-square rounded-xl" />
      ))}
    </div>
  )
}
