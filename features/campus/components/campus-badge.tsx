import type { University } from "@/features/universities/types"
import { cn } from "@/lib/utils"
import { campusInitials } from "../utils/labels"

/** A campus logo, or its initials when it has none. */
export function CampusBadge({
  campus,
  className,
}: {
  campus: Pick<University, "acronym" | "logo_url">
  className?: string
}) {
  if (campus.logo_url) {
    return (
      <img
        src={campus.logo_url}
        alt=""
        className={cn("size-11 shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-extrabold text-muted-foreground",
        className
      )}
    >
      {campusInitials(campus)}
    </span>
  )
}
