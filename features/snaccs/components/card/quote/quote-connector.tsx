import { cn } from "@/lib/utils"

const REACH = 30

/// The rail and the curve both hang off the centre of whatever column they sit in, so an avatar
/// of any size keeps the line straight.
export function QuoteRail({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto mt-2 w-0.5 flex-1 bg-border", className)} />
  )
}

export function QuoteCurve() {
  return (
    <div className="relative h-8">
      <div
        className="absolute inset-y-0 left-1/2 -ml-px rounded-bl-xl border-b-2 border-l-2 border-border"
        style={{ width: REACH }}
      />
    </div>
  )
}
