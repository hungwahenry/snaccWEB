import { CheckCheckIcon, WifiOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type ClipsEndProps = {
  height: number
  failed: boolean
  onRetry: () => void
  onClose: () => void
}

export function ClipsEnd({ height, failed, onRetry, onClose }: ClipsEndProps) {
  const Icon = failed ? WifiOffIcon : CheckCheckIcon

  return (
    <div
      style={{ height }}
      className="flex snap-start snap-always flex-col items-center justify-center gap-3 bg-black px-8"
    >
      <Icon className="size-10 text-white" />
      <p className="text-lg font-extrabold text-white">
        {failed ? "Could not load more clips" : "You’re all caught up"}
      </p>
      <p className="text-center text-sm text-white/70">
        {failed
          ? "Check your connection and try again."
          : "New clips show up here as people post them."}
      </p>
      <Button
        variant="secondary"
        className="mt-2 rounded-full"
        onClick={failed ? onRetry : onClose}
      >
        {failed ? "Try again" : "Back to feed"}
      </Button>
    </div>
  )
}
