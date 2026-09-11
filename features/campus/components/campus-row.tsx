import Link from "next/link"
import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { University } from "@/features/universities/types"
import { campusPath } from "../routes"
import { CampusBadge } from "./campus-badge"

export const CampusRow = memo(function CampusRow({
  university,
}: {
  university: University
}) {
  return (
    <Link
      href={campusPath(university.slug)}
      className="flex items-center gap-3 px-4 py-3 transition-colors outline-none hover:bg-accent/40 focus-visible:bg-accent/40"
    >
      <CampusBadge campus={university} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-extrabold text-foreground">
          {university.acronym}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {university.name}
        </span>
      </span>
    </Link>
  )
})

export function CampusRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-44" />
      </div>
    </div>
  )
}
