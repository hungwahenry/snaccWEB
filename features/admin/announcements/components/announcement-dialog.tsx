"use client"

import type { ReactElement } from "react"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { Option } from "@/features/admin/shell/types"
import type { AnnouncementAudience, AnnouncementDraft } from "../types"
import {
  EMPTY_DRAFT,
  isDraftReady,
  MESSAGE_MAX,
  TITLE_MAX,
} from "../utils/announcement"

const AUDIENCES: Option<AnnouncementAudience>[] = [
  { value: "all", label: "Everyone" },
  { value: "campus", label: "One campus" },
]

function AnnouncementForm({
  campuses,
  onSubmit,
}: {
  campuses: Option[]
  onSubmit: (draft: AnnouncementDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(EMPTY_DRAFT)

  return (
    <DialogForm
      submitLabel="Send"
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <TextField label="Title" maxLength={TITLE_MAX} {...text("title")} />
      <TextField
        label="Message"
        multiline
        rows={4}
        maxLength={MESSAGE_MAX}
        {...text("message")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Who gets it"
          value={draft.audience}
          onChange={(audience) => set("audience", audience)}
          options={AUDIENCES}
        />
        {draft.audience === "campus" ? (
          <SelectField
            label="Campus"
            value={draft.universityId}
            onChange={(id) => set("universityId", id)}
            options={campuses}
            placeholder="Pick a campus"
          />
        ) : null}
      </div>
      <FormNote>
        It reaches everyone it is meant for straight away, with a push. A push
        cannot be taken back once it is sent.
      </FormNote>
    </DialogForm>
  )
}

export function AnnouncementDialog({
  campuses,
  trigger,
  disabled,
  onSubmit,
}: {
  campuses: Option[]
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: AnnouncementDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Send an announcement"
    >
      <AnnouncementForm campuses={campuses} onSubmit={onSubmit} />
    </FormDialog>
  )
}
