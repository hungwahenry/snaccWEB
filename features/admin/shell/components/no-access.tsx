import { ShieldOff } from "lucide-react"
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
      <EmptyDescription>
        This page needs the <code>{permission}</code> permission. Ask an owner
        if you think you should have it.
      </EmptyDescription>
    </Empty>
  )
}
