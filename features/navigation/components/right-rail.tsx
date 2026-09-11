import { SearchIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { SEARCH_PATH } from "@/features/search/routes"

export function RightRail({
  showSearch,
  children,
}: {
  showSearch: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-3">
      {showSearch ? (
        <Link
          href={SEARCH_PATH}
          className="flex h-11 items-center gap-3 rounded-full bg-input px-4 text-muted-foreground transition-colors hover:bg-accent"
        >
          <SearchIcon className="size-5" />
          <span className="text-sm">Search people, snaccs, tags</span>
        </Link>
      ) : null}
      {children}
    </div>
  )
}
