"use client"

import type { ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminRole, RoleDraft } from "../types"
import {
  draftFrom,
  isDraftReady,
  isSlugValid,
  ROLE_LIMITS,
} from "../utils/roles"

function RoleForm({
  role,
  onSubmit,
}: {
  role?: AdminRole
  onSubmit: (draft: RoleDraft) => Promise<unknown>
}) {
  const { draft, text } = useDraft(() => draftFrom(role))
  const editing = role !== undefined
  const badSlug =
    !editing && draft.slug.trim() !== "" && !isSlugValid(draft.slug)

  return (
    <DialogForm
      submitLabel={editing ? "Save" : "Create role"}
      canSubmit={isDraftReady(draft, editing)}
      onSubmit={() => onSubmit(draft)}
    >
      {editing ? null : (
        <TextField
          label="Slug"
          placeholder="finance"
          maxLength={ROLE_LIMITS.slug}
          hint={
            badSlug
              ? "Start with a letter, then only lowercase letters, numbers, - or _."
              : "How the role is known in code and logs. It cannot change later."
          }
          {...text("slug")}
        />
      )}
      <TextField
        label="Name"
        placeholder="Finance"
        maxLength={ROLE_LIMITS.name}
        {...text("name")}
      />
      <TextField
        label="Description"
        optional
        maxLength={ROLE_LIMITS.description}
        {...text("description")}
      />
    </DialogForm>
  )
}

export function RoleDialog({
  role,
  trigger,
  disabled,
  onSubmit,
}: {
  role?: AdminRole
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: RoleDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={role ? `Edit ${role.name}` : "New role"}
    >
      <RoleForm role={role} onSubmit={onSubmit} />
    </FormDialog>
  )
}
