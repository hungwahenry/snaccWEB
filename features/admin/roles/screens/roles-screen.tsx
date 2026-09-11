"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { RoleDialog } from "../components/role-dialog"
import { RolesTable } from "../components/roles-table"
import { useRolesScreen } from "../hooks/use-roles-screen"

export function RolesScreen() {
  const { query, groups, actions } = useRolesScreen()

  return (
    <>
      <PageHeader
        title="Roles"
        description="Bundles of permissions you can give to admins."
        action={
          <CanAct permission="roles.write">
            <RoleDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  New role
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <RolesTable
        query={query}
        groups={groups}
        onSave={actions.save}
        onSetPermissions={actions.setPermissions}
        onDelete={actions.remove}
      />
    </>
  )
}
