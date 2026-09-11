"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { EmptyNote } from "@/features/admin/shell/components/detail"
import { CheckboxField } from "@/features/admin/shell/components/form-fields"
import { plural } from "@/features/admin/shell/utils/format"
import type { AdminRole, PermissionGroup } from "../types"
import { toggleKey } from "../utils/roles"

function PermissionsForm({
  role,
  groups,
  onSubmit,
}: {
  role: AdminRole
  groups: PermissionGroup[]
  onSubmit: (keys: string[]) => Promise<unknown>
}) {
  const [checked, setChecked] = useState<ReadonlySet<string>>(
    () => new Set(role.permission_keys)
  )

  return (
    <DialogForm
      submitLabel={`Save ${plural(checked.size, "permission")}`}
      canSubmit={groups.length > 0}
      onSubmit={() => onSubmit([...checked])}
    >
      {groups.length === 0 ? (
        <EmptyNote>
          The list of permissions has not loaded. Close this and try again in a
          moment.
        </EmptyNote>
      ) : null}
      {groups.map((group) => (
        <fieldset key={group.resource} className="flex flex-col gap-2">
          <legend className="mb-1 font-mono text-xs font-semibold text-muted-foreground">
            {group.resource}
          </legend>
          {group.permissions.map((permission) => (
            <CheckboxField
              key={permission.key}
              checked={checked.has(permission.key)}
              onChange={() =>
                setChecked((current) => toggleKey(current, permission.key))
              }
              label={
                <span className="font-mono text-xs">{permission.action}</span>
              }
              hint={permission.description}
            />
          ))}
        </fieldset>
      ))}
    </DialogForm>
  )
}

export function PermissionsDialog({
  role,
  groups,
  trigger,
  disabled,
  onSubmit,
}: {
  role: AdminRole
  groups: PermissionGroup[]
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (keys: string[]) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={`What ${role.name} can do`}
      description="Everyone holding this role gets exactly these, straight away."
    >
      <PermissionsForm role={role} groups={groups} onSubmit={onSubmit} />
    </FormDialog>
  )
}
