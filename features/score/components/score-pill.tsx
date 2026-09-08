import { NamedIcon } from "@/lib/icons/named-icon"
import { cn } from "@/lib/utils"
import type { ScoreTier } from "@/features/score/types"

export function ScorePill({
  tier,
  points,
  href,
}: {
  tier: ScoreTier | null
  /** Only on your own profile: the number behind the tier is yours alone. */
  points?: number
  href?: string
}) {
  const body = (
    <>
      {tier?.icon ? (
        <NamedIcon name={tier.icon} color={tier.color} size={14} />
      ) : null}
      <span
        className="text-sm font-bold text-foreground"
        style={tier?.color ? { color: tier.color } : undefined}
      >
        {tier?.label ?? "Fresher"}
      </span>
      {points === undefined ? null : (
        <span className="text-sm font-bold text-muted-foreground tabular-nums">
          {points.toLocaleString()}
        </span>
      )}
    </>
  )

  const className =
    "inline-flex items-center gap-1.5 self-start rounded-full bg-muted py-1 pr-3 pl-2.5"

  if (!href) return <span className={className}>{body}</span>

  return (
    <a
      href={href}
      aria-label="Snacc Score"
      className={cn(className, "transition-opacity hover:opacity-80")}
    >
      {body}
    </a>
  )
}
