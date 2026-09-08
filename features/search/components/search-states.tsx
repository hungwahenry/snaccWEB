import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"

export function SearchEmpty({
  loading,
  failed,
  onRetry,
  icon,
  title,
  description,
  skeleton,
}: {
  loading: boolean
  failed: boolean
  onRetry: () => void
  icon: LucideIcon
  title: string
  description?: string
  skeleton?: ReactNode
}) {
  if (failed)
    return <LoadFailed title="Something went wrong" onRetry={onRetry} />
  if (loading) {
    if (skeleton) return <>{skeleton}</>
    return (
      <div className="flex justify-center py-16">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      className="py-16"
    />
  )
}
