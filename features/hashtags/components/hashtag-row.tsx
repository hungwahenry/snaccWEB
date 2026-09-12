import { HashIcon } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { hashtagPath } from "../routes"
import type { Hashtag } from "../types"
import { hashtagLabel, hashtagUsage } from "../utils/labels"

export const HashtagRow = memo(function HashtagRow({
  hashtag,
}: {
  hashtag: Hashtag
}) {
  return (
    <Link
      href={hashtagPath(hashtag.tag)}
      className="flex items-center gap-3 px-4 py-3 transition-colors outline-none hover:bg-accent/40 focus-visible:bg-accent/40"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <HashIcon className="size-5 text-muted-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-extrabold text-foreground">
          {hashtagLabel(hashtag.tag)}
        </span>
        <span className="block text-sm text-muted-foreground">
          {hashtagUsage(hashtag)}
        </span>
      </span>
    </Link>
  )
})
