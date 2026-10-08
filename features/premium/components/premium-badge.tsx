import { BadgeCheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label="Premium"
      className={cn(
        "flex items-center justify-center rounded-full bg-background p-0.5",
        className
      )}
    >
      <BadgeCheckIcon className="size-3.5 text-premium" aria-hidden />
    </span>
  )
}
