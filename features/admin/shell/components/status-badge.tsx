import { Badge } from "@/components/ui/badge"
import type { StatusMeta } from "../types"

export function StatusBadge({
  status,
  className,
}: {
  status: StatusMeta
  className?: string
}) {
  return (
    <Badge variant={status.variant} className={className}>
      {status.label}
    </Badge>
  )
}
