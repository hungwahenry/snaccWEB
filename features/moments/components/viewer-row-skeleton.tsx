import { Skeleton } from "@/components/ui/skeleton"
import { UserRowSkeleton } from "@/features/users/components/user-row-skeleton"

export function ViewerRowSkeleton() {
  return <UserRowSkeleton trailing={<Skeleton className="my-0.5 h-3 w-8" />} />
}
