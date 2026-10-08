import { Skeleton } from "@/components/ui/skeleton"

const TILES = 6

export function ChatThemeSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6 px-6 py-6">
      <Skeleton className="h-80 rounded-3xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-16 rounded-full" />
        <div className="grid grid-cols-3 gap-x-3 gap-y-4">
          {Array.from({ length: TILES }, (_, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-3 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
