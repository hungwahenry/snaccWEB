import Link from "next/link"
import { memo } from "react"
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
