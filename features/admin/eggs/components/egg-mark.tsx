import { cn } from "@/lib/utils"
import type { AdminEgg } from "../types"

/** The egg's artwork, or a disc in its colour while it has none. */
export function EggMark({
  egg,
  className,
}: {
  egg: Pick<AdminEgg, "image_url" | "color">
  className?: string
}) {
  if (egg.image_url) {
    return (
      <img
        src={egg.image_url}
        alt=""
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={cn("shrink-0 rounded-full", className)}
      style={{ backgroundColor: egg.color }}
    />
  )
}
