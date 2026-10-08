import { BadgeCheckIcon } from "lucide-react"

export function PremiumChip() {
  return (
    <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-premium/15 py-0.5 pr-2 pl-1.5 text-[11px] leading-4 font-semibold text-premium">
      <BadgeCheckIcon className="size-[13px]" aria-hidden />
      Premium
    </span>
  )
}
