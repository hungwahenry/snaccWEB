"use client"

import { cashtagPath } from "@/features/cashtags/routes"
import { hashtagPath } from "@/features/hashtags/routes"
import { useTierLookup } from "@/providers/tiers-provider"
import { profilePath } from "@/features/users/routes"
import { cn } from "@/lib/utils"
import type { SnaccEntity } from "../../types"
import { EntityText } from "./entity-text"

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
    <EntityText
      body={body}
      entities={entities}
      stripLinks={stripLinks}
      hrefFor={entityPath}
      className={cn(
        "text-base leading-6 break-words whitespace-pre-wrap text-foreground",
        className
      )}
      entityClassName="font-extrabold hover:underline"
      entityStyle={(entity) => ({ color: entityColor(entity) })}
    />
  )
}
