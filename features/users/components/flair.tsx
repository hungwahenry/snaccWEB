"use client"

import { BadgeCheckIcon } from "lucide-react"
import { useTier } from "@/features/score/hooks/use-tier"
import type { UserScore } from "@/features/score/types"
import { NamedIcon } from "@/lib/icons/named-icon"
import { cn } from "@/lib/utils"

export function TierName({
  score,
  official,
  birthday,
  name,
  className,
  iconSize = 16,
}: {
  score?: UserScore | null
  official?: boolean
  birthday?: boolean
  name: string | null
  className?: string
  iconSize?: number
}) {
  const tier = useTier(score?.tier)

  return (
    <>
      <span
        className={cn("min-w-0 truncate", className)}
        style={tier?.color ? { color: tier.color } : undefined}
      >
        {name}
      </span>
      {tier?.icon ? (
        <NamedIcon
          name={tier.icon}
          color={tier.color}
          size={iconSize}
          className="shrink-0"
        />
      ) : null}
      {official ? (
        <BadgeCheckIcon size={iconSize} className="shrink-0 text-foreground" />
      ) : null}
      {birthday ? <span style={{ fontSize: iconSize - 2 }}>🎂</span> : null}
    </>
  )
}

export function OgBadge({ score }: { score?: UserScore | null }) {
  if (!score?.og) return null

  return (
    <span className="bg-success shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold text-white dark:text-black">
      OG
    </span>
  )
}
