import { HashIcon } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { hashtagPath } from "@/features/hashtags/routes"
import type { SearchHashtag } from "@/features/hashtags/types"

export function HashtagRow({ hashtag }: { hashtag: SearchHashtag }) {
  return (
    <Link
      href={hashtagPath(hashtag.tag)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <HashIcon className="size-5 text-muted-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-extrabold text-foreground">
          #{hashtag.tag}
        </span>
        <span className="block text-sm text-muted-foreground">
          {hashtag.usage_count} {hashtag.usage_count === 1 ? "snacc" : "snaccs"}
        </span>
      </span>
    </Link>
  )
}

export function HashtagRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
