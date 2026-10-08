import { Skeleton } from "@/components/ui/skeleton"

export function StickerGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div aria-hidden className="grid grid-cols-4 gap-1.5 px-4">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="aspect-square" />
      ))}
    </div>
  )
}
