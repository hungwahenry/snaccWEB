import type { MomentRing } from "@/features/users/types"
import { cn } from "@/lib/utils"
import { ringColors, ringGradient } from "../utils/ring"

export function StoryRing({
  ring,
  color,
}: {
  ring: MomentRing
  color: string | null
}) {
  const sweep = ring.unseen > 0 ? ringColors(color) : null

  if (!sweep) {
    return (
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-[5px] rounded-full border-2",
          ring.unseen > 0 ? "border-primary" : "border-border"
        )}
      />
    )
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -inset-[5px] rounded-full p-[3px]"
      style={{ background: ringGradient(sweep) }}
    >
      <span className="block size-full rounded-full bg-background" />
    </span>
  )
}
