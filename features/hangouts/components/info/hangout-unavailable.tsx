import { CalendarXIcon, MessageSquareDashedIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import type { HangoutPageState } from "../../hooks/info/use-hangout-page"

export function HangoutUnavailable({
  state,
  onRetry,
}: {
  state: Exclude<HangoutPageState, "ready">
  onRetry: () => void
}) {
  return (
    <div className="py-24">
      {state === "off" ? (
        <EmptyState
          icon={CalendarXIcon}
          title="Not available"
          description="Hangouts are switched off right now."
        />
      ) : state === "missing" ? (
        <EmptyState
          icon={MessageSquareDashedIcon}
          title="This hangout isn't available"
          description="It may have been deleted, or hidden."
        />
      ) : (
        <LoadFailed title="Could not load this hangout" onRetry={onRetry} />
      )}
    </div>
  )
}
