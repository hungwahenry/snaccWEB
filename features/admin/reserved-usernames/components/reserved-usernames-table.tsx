"use client"

import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DataTable,
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { plural } from "@/features/admin/shell/utils/format"
import type { AdminReservedUsername, HoldUsernameInput } from "../types"
import { collidesWithRoute } from "../utils/reserved-usernames"
import { HoldUsernameDialog } from "./hold-username-dialog"

export function ReservedUsernamesTable({
  names,
  total,
  toolbar,
  onHold,
  onRelease,
}: {
  names: AdminReservedUsername[]
  total: number
  toolbar: ReactNode
  onHold: (draft: HoldUsernameInput) => Promise<unknown>
  onRelease: (name: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminReservedUsername>[]>(
    () => [
      {
        id: "name",
        header: "Username",
        className: "w-56 font-mono text-sm",
        cell: (held) => held.name,
      },
      {
        id: "reason",
        header: "Why",
        className: "text-sm text-muted-foreground",
        cell: (held) => held.reason,
      },
      {
        id: "origin",
        header: "Origin",
        className: "w-32",
        cell: (held) =>
          held.seeded ? null : <Badge variant="outline">added here</Badge>,
      },
      {
        id: "release",
        header: <HiddenHeader>Release</HiddenHeader>,
        align: "end",
        className: "w-28",
        cell: (held) => (
          <ConfirmAction
            trigger={
              <Button variant="ghost" size="sm">
                Release
              </Button>
            }
            title={held.name}
            description={
              <>
                Held because: {held.reason}. Releasing it lets anyone register
                it, and it will not come back on the next deploy — this table is
                what is enforced.
                {collidesWithRoute(held) ? (
                  <span className="mt-2 block text-foreground">
                    This one collides with a URL. Whoever takes it gets a
                    profile page nobody can open, because the route wins.
                  </span>
                ) : null}
              </>
            }
            confirmLabel="Release"
            onConfirm={() => onRelease(held.name)}
          />
        ),
      },
    ],
    [onRelease]
  )

  return (
    <TableFrame
      title={`${plural(total, "name")} held`}
      description="Every one can be released. Snacc seeds this list on a fresh install and never overrides it again."
      actions={
        <CanAct permission="reserved_usernames.write">
          <HoldUsernameDialog
            trigger={<Button size="sm">Hold a name</Button>}
            onSubmit={onHold}
          />
        </CanAct>
      }
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        rows={names}
        rowKey={(held) => held.name}
        empty="Nothing matches that."
        hideHeader
      />
    </TableFrame>
  )
}
