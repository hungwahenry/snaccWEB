"use client"

import Link from "next/link"
import { cashtagPath } from "@/features/cashtags/routes"
import { hashtagPath } from "@/features/hashtags/routes"
import { useTierLookup } from "@/providers/tiers-provider"
import { profilePath } from "@/features/users/routes"
import { cn } from "@/lib/utils"
import type { SnaccEntity } from "../../types"
import { toRenderedSegments } from "../../utils/entities"

type SnaccBodyProps = {
  body: string | null
  entities: SnaccEntity[]
  /** Only where the link's card renders underneath; a quote keeps its links as text. */
  stripLinks?: boolean
  className?: string
}

function entityPath(entity: SnaccEntity): string {
  if (entity.type === "mention") return profilePath(entity.user.username)
  if (entity.type === "hashtag") return hashtagPath(entity.tag)
  return cashtagPath(entity.symbol)
}

export function SnaccBody({
  body,
  entities,
  stripLinks,
  className,
}: SnaccBodyProps) {
  const tierOf = useTierLookup()

  if (!body) return null

  function entityColor(entity: SnaccEntity): string | undefined {
    if (entity.type === "mention")
      return tierOf(entity.user.tier)?.color || undefined
    return undefined
  }

  return (
    <p
      className={cn(
        "text-base leading-6 break-words whitespace-pre-wrap text-foreground",
        className
      )}
    >
      {toRenderedSegments(body, entities, stripLinks).map((segment, index) => {
        if (!segment.entity) return segment.text
        return (
          <Link
            key={index}
            href={entityPath(segment.entity)}
            onClick={(event) => event.stopPropagation()}
            className="font-extrabold hover:underline"
            style={{ color: entityColor(segment.entity) }}
          >
            {segment.text}
          </Link>
        )
      })}
    </p>
  )
}
