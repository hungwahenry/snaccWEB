import Link from "next/link"
import { campusPath } from "@/features/campus/routes"
import type { University } from "@/features/universities/types"

export function CampusRow({ university }: { university: University }) {
  return (
    <Link
      href={campusPath(university.slug)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-extrabold text-muted-foreground">
        {university.acronym.slice(0, 2).toUpperCase()}
      </span>
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
}
