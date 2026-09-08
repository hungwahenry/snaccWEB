import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { CloudOffIcon } from "lucide-react"

interface LoadFailedProps {
  title?: string
  onRetry: () => void
}

export function LoadFailed({ title, onRetry }: LoadFailedProps) {
  return (
    <EmptyState
      icon={CloudOffIcon}
      title={title ?? "Could not load that"}
      description="Check your connection and try again."
      action={
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  )
}
