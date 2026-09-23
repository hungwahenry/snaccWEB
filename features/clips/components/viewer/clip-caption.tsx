"use client"

import Link from "next/link"
import { useState } from "react"
import { SnaccBody } from "@/features/snaccs/components/card/snacc-body"
import { profilePath } from "@/features/users/routes"
import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { PlayableClip } from "../../utils/viewer"

export function ClipCaption({ snacc }: { snacc: PlayableClip }) {
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const expanded = expandedFor === snacc.id

  return (
    <div className="flex flex-col gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2">
        <Link
          href={profilePath(snacc.author.username)}
          className="min-w-0 truncate text-[15px] font-extrabold text-white hover:underline"
        >
          {snacc.author.username}
        </Link>
        <span className="shrink-0 text-sm text-white/70">
          {timeAgo(snacc.created_at)}
        </span>
      </div>

      {snacc.body ? (
        <div
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-label={
            expanded ? "Show less of the caption" : "Show the whole caption"
          }
          onClick={() => setExpandedFor(expanded ? null : snacc.id)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return
            setExpandedFor(expanded ? null : snacc.id)
          }}
          className={cn(
            "cursor-pointer text-left",
            expanded && "max-h-[40dvh] overflow-y-auto"
          )}
        >
          <SnaccBody
            body={snacc.body}
            entities={snacc.entities}
            className={cn(
              "text-[15px] leading-5 text-white",
              !expanded && "line-clamp-2"
            )}
          />
        </div>
      ) : null}
    </div>
  )
}
