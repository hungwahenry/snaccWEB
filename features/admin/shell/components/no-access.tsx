import { ShieldOff } from "lucide-react"
import { denialReason } from "@/features/admin/auth/utils/permission"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function NoAccess({ permission }: { permission: string }) {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <ShieldOff />
      </EmptyMedia>
      <EmptyTitle>Not your area</EmptyTitle>
      <EmptyDescription>{denialReason(undefined, permission)}</EmptyDescription>
    </Empty>
  )
}
