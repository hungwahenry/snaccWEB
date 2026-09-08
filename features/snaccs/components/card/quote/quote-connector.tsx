import { cn } from "@/lib/utils"

/// The thread line down from an avatar, the way a quote hangs off the post that made it.
export function QuoteRail({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto mt-2 w-0.5 flex-1 rounded-full bg-border",
        className
      )}
    />
  )
}

export function QuoteCurve() {
  return (
    <div className="ml-[21px] h-8 w-[30px] rounded-bl-xl border-b-2 border-l-2 border-border" />
  )
}
