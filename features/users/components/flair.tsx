"use client"

import { BadgeCheckIcon, BadgeIcon, CheckIcon } from "lucide-react"
import { useTier } from "@/features/score/hooks/use-tier"
import type { UserScore } from "@/features/score/types"
import { NamedIcon } from "@/lib/icons/named-icon"
import { cn } from "@/lib/utils"

/** Someone's name in their tier's colour, followed by the marks they have earned. */
export function TierName({
  score,
  official,
  birthday,
  name,
  className,
  iconSize = 16,
  showTierIcon = false,
}: {
  score?: UserScore | null
  official?: boolean
  birthday?: boolean
  name: string | null
  className?: string
  iconSize?: number
  showTierIcon?: boolean
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
      {showTierIcon && tier?.icon ? (
        <NamedIcon
          name={tier.icon}
          color={tier.color}
          size={iconSize}
          className="shrink-0"
        />
      ) : null}
      {official ? (
        <BadgeCheckIcon
          size={iconSize}
          role="img"
          aria-label="Official account"
          className="shrink-0 text-foreground"
        />
      ) : null}
      {birthday ? (
        <span
          role="img"
          aria-label="Birthday today"
          style={{ fontSize: iconSize - 2 }}
        >
          🎂
        </span>
      ) : null}
    </>
  )
}

export const PREMIUM_COLOR = "#E8A33D"

export function PremiumBadge({
  premium,
  size = 16,
}: {
  premium?: boolean
  size?: number
}) {
  if (!premium) return null

  return (
    <span
      role="img"
      aria-label="Premium"
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <BadgeIcon size={size} color={PREMIUM_COLOR} fill={PREMIUM_COLOR} />
      <CheckIcon
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        size={size * 0.5}
        color="#FFFFFF"
        strokeWidth={3.5}
      />
    </span>
  )
}

export function OgBadge({ score }: { score?: UserScore | null }) {
  if (!score?.og) return null

  return (
    <span className="shrink-0 rounded-full bg-success px-1.5 py-0.5 text-[11px] font-bold text-white dark:text-black">
      OG
    </span>
  )
}
