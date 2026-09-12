import Link from "next/link"
import { Eyebrow } from "@/components/ui/eyebrow"
import { hashtagPath } from "../routes"
import type { Hashtag } from "../types"
import { hashtagLabel } from "../utils/labels"

export function TrendingTags({ tags }: { tags: Hashtag[] }) {
  if (tags.length === 0) return null

  return (
    <section aria-label="Trending tags" className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">Trending</Eyebrow>
      <div className="flex flex-wrap gap-2 px-1">
        {tags.map((hashtag) => (
          <Link
            key={hashtag.tag}
            href={hashtagPath(hashtag.tag)}
            className="rounded-full bg-muted px-3.5 py-2 text-sm font-bold text-foreground transition-colors outline-none hover:bg-accent focus-visible:bg-accent"
          >
            {hashtagLabel(hashtag.tag)}
          </Link>
        ))}
      </div>
    </section>
  )
}
