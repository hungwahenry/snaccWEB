"use client"

import { ShieldOff } from "lucide-react"
import type { ReactNode } from "react"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/features/admin/auth/hooks/use-auth"
import { can } from "@/lib/permissions"

export function RequirePermission({
  permission,
  children,
}: {
  permission: string
  children: ReactNode
}) {
  const me = useMe()

  if (me.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (!can(me.data?.permissions, permission)) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <ShieldOff />
        </EmptyMedia>
        <EmptyTitle>Not your area</EmptyTitle>
        <EmptyDescription>
          This needs the <code>{permission}</code> permission. Ask an owner if
          you think you should have it.
        </EmptyDescription>
      </Empty>
    )
  }

  return <>{children}</>
}
