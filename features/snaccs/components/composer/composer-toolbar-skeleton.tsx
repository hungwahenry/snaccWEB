import { Skeleton } from "@/components/ui/skeleton"

export function ComposerToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <Skeleton className="size-9 rounded-full" />
      <Skeleton className="mr-2 h-10 w-18 rounded-full" />
    </div>
  )
}
