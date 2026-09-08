import Link from "next/link"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { hashtagPath } from "@/features/hashtags/routes"
import type { SearchHashtag } from "@/features/hashtags/types"

export function TrendingTags({ tags }: { tags: SearchHashtag[] }) {
  if (tags.length === 0) return null

  return (
    <section className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">Trending</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {tags.map((hashtag) => (
          <Link
            key={hashtag.tag}
            href={hashtagPath(hashtag.tag)}
            className="rounded-full bg-muted px-3.5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            #{hashtag.tag}
          </Link>
        ))}
      </div>
    </section>
  )
}

const CHIP_WIDTHS = [72, 96, 64, 110, 80, 88, 68, 102]

export function TrendingTagsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="h-3 w-16" />
      <div className="flex flex-wrap gap-2">
        {CHIP_WIDTHS.map((width, i) => (
          <Skeleton key={i} className="h-9 rounded-full" style={{ width }} />
        ))}
      </div>
    </div>
  )
}
