import { Skeleton } from "@/components/ui/skeleton"

const CELLS = 8

export function RecipientGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-y-2">
      {Array.from({ length: CELLS }, (_, cell) => (
        <div
          key={cell}
          className="flex flex-col items-center gap-1.5 px-1 py-2"
        >
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="my-0.5 h-3 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}
