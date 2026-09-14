"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { AdminAppIcon, MoveDirection } from "../types"
import { canMove } from "../utils/app-icons"
import { AppIconDialog } from "./app-icon-dialog"

export function AppIconsTable({
  query,
  onMove,
  onRename,
  onSetEnabled,
}: {
  query: UseQueryResult<AdminAppIcon[]>
  onMove: (id: string, direction: MoveDirection) => Promise<unknown> | void
  onRename: (id: string, label: string) => Promise<unknown>
  onSetEnabled: (id: string, enabled: boolean) => Promise<unknown>
}) {
  const icons = query.data
  const columns = useMemo<Column<AdminAppIcon>[]>(
    () => [
      {
        id: "order",
        header: "Order",
        className: "w-24",
        cell: (icon) => (
          <div className="flex gap-1">
            <CanAct permission="app_icons.write">
              <ActionButton
                size="icon-sm"
                variant="ghost"
                disabled={!canMove(icons ?? [], icon.id, "up")}
                aria-label={`Move ${icon.label} up`}
                onClick={() => onMove(icon.id, "up")}
              >
                <ArrowUp />
              </ActionButton>
            </CanAct>
            <CanAct permission="app_icons.write">
              <ActionButton
                size="icon-sm"
                variant="ghost"
                disabled={!canMove(icons ?? [], icon.id, "down")}
                aria-label={`Move ${icon.label} down`}
                onClick={() => onMove(icon.id, "down")}
              >
                <ArrowDown />
              </ActionButton>
            </CanAct>
          </div>
        ),
      },
      {
        id: "icon",
        header: "Icon",
        className: "font-mono text-xs text-muted-foreground",
        cell: (icon) => icon.key,
      },
      {
        id: "label",
        header: "Name in the picker",
        className: "font-medium",
        cell: (icon) => icon.label,
      },
      {
        id: "offered",
        header: "Offered",
        align: "end",
        className: "w-28",
        cell: (icon) => (
          <CanAct permission="app_icons.write">
            <ActionSwitch
              checked={icon.enabled}
              label={`Offer ${icon.label} in the picker`}
              onChange={(enabled) => onSetEnabled(icon.id, enabled)}
            />
          </CanAct>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (icon) => (
          <CanAct permission="app_icons.write">
            <AppIconDialog
              icon={icon}
              trigger={
                <Button variant="outline" size="sm">
                  Rename
                </Button>
              }
              onSubmit={(label) => onRename(icon.id, label)}
            />
          </CanAct>
        ),
      },
    ],
    [icons, onMove, onRename, onSetEnabled]
  )

  return (
    <QueryTable
      query={query}
      what="app icons"
      columns={columns}
      rowKey={(icon) => icon.id}
      empty="No app icons yet."
    />
  )
}
