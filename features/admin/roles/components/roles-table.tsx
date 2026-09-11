"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { AdminRole, PermissionGroup, RoleDraft } from "../types"
import { accessSummary } from "../utils/roles"
import { PermissionsDialog } from "./permissions-dialog"
import { RoleDialog } from "./role-dialog"

export function RolesTable({
  query,
  groups,
  onSave,
  onSetPermissions,
  onDelete,
}: {
  query: UseQueryResult<AdminRole[]>
  groups: PermissionGroup[]
  onSave: (draft: RoleDraft, id: string) => Promise<unknown>
  onSetPermissions: (id: string, keys: string[]) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminRole>[]>(
    () => [
      {
        id: "role",
        header: "Role",
        className: "whitespace-normal",
        cell: (role) => (
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium">
              {role.name}
              {role.is_system ? (
                <Badge variant="outline">Built in</Badge>
              ) : null}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {role.slug}
            </p>
            {role.description ? (
              <p className="mt-0.5 text-xs text-pretty text-muted-foreground">
                {role.description}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        id: "access",
        header: "Access",
        cell: (role) => (
          <Badge variant={role.allow_all ? "default" : "outline"}>
            {accessSummary(role)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (role) => (
          <div className="flex justify-end gap-2">
            {role.allow_all ? null : (
              <CanAct permission="roles.write">
                <PermissionsDialog
                  role={role}
                  groups={groups}
                  trigger={
                    <Button variant="outline" size="sm">
                      Permissions
                    </Button>
                  }
                  onSubmit={(keys) => onSetPermissions(role.id, keys)}
                />
              </CanAct>
            )}
            <CanAct permission="roles.write">
              <RoleDialog
                role={role}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, role.id)}
              />
            </CanAct>
            {role.is_system ? null : (
              <CanAct permission="roles.delete">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
                  }
                  title={`Delete ${role.name}?`}
                  description="Everyone holding it loses what it granted, straight away."
                  confirmLabel="Delete role"
                  onConfirm={() => onDelete(role.id)}
                />
              </CanAct>
            )}
          </div>
        ),
      },
    ],
    [groups, onSave, onSetPermissions, onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="roles"
      columns={columns}
      rowKey={(role) => role.id}
      empty="No roles yet."
    />
  )
}
