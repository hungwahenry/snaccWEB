import { Skeleton } from "@/components/ui/skeleton"
import { UserRowSkeleton } from "@/features/users/components/user-row-skeleton"

export function BlockedRowSkeleton() {
  return (
    <UserRowSkeleton
      trailing={<Skeleton className="h-8 w-[76px] rounded-full" />}
    />
  )
}
