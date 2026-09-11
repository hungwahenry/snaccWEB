"use client"

import type { ReactElement } from "react"
import {
  SwitchField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { NotificationTypeDraft, NotificationTypeRow } from "../types"
import {
  draftFrom,
  isDraftReady,
  WINDOW_INVALID,
} from "../utils/notification-types"

function NotificationTypeForm({
  row,
  onSubmit,
}: {
  row: NotificationTypeRow
  onSubmit: (draft: NotificationTypeDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(row))
  const ready = isDraftReady(draft)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={ready}
      onSubmit={() => onSubmit(draft)}
    >
      <TextField label="Label" {...text("label")} />
      <TextField label="Body" {...text("body")} />
      <TextField label="Detail" {...text("detail")} />
      {row.aggregates ? (
        <TextField
          label="Group window (minutes)"
          inputMode="numeric"
          placeholder="Blank groups indefinitely"
          hint={
            ready ? (
              "How long one row keeps absorbing new events before a fresh one starts. Without a window a single row grows for the life of the account."
            ) : (
              <span className="text-destructive">{WINDOW_INVALID}</span>
            )
          }
          {...text("window")}
        />
      ) : null}
      <div className="flex flex-col gap-3">
        <SwitchField
          label="Push by default"
          checked={draft.push}
          onChange={(value) => set("push", value)}
        />
        {row.emailable ? (
          <>
            <SwitchField
              label="Email by default"
              checked={draft.email}
              onChange={(value) => set("email", value)}
            />
            <SwitchField
              label="Email the moment it happens"
              checked={draft.instant}
              onChange={(value) => set("instant", value)}
            />
          </>
        ) : null}
      </div>
    </DialogForm>
  )
}

export function NotificationTypeDialog({
  row,
  trigger,
  disabled,
  onSubmit,
}: {
  row: NotificationTypeRow
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: NotificationTypeDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={row.label}
      description="Wording supports placeholders like {actor} and {amount|naira}."
    >
      <NotificationTypeForm row={row} onSubmit={onSubmit} />
    </FormDialog>
  )
}
