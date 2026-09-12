import { Skeleton } from "@/components/ui/skeleton"
import { UserRowSkeleton } from "@/features/users/components/user-row-skeleton"

export function ReactorRowSkeleton() {
  return (
    <UserRowSkeleton trailing={<Skeleton className="size-5 rounded-full" />} />
  )
}
