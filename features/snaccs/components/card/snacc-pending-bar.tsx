import { TriangleAlertIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import type { SnaccStatus } from "../../types"

export function SnaccPendingBar({
  status,
  onRetry,
  onDiscard,
}: {
  status: SnaccStatus
  onRetry: () => void
  onDiscard: () => void
}) {
  if (status === "sending") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" /> Posting…
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <TriangleAlertIcon className="size-4 text-destructive" />
      <span className="text-sm font-bold text-destructive">
        Couldn&apos;t post
      </span>
      <span className="flex-1" />
      <button
        type="button"
        onClick={onRetry}
        className="text-sm font-bold text-foreground active:opacity-60"
      >
        Retry
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="px-3 text-sm font-bold text-muted-foreground active:opacity-60"
      >
        Discard
      </button>
    </div>
  )
}
