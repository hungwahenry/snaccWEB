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
import type { AdminUniversity, UniversityDraft } from "../types"
import {
  draftFrom,
  isDraftReady,
  OWNERSHIP_CHOICES,
  STATE_CHOICES,
  UNIVERSITY_LIMITS,
} from "../utils/university"

function UniversityForm({
  university,
  onSubmit,
}: {
  university?: AdminUniversity
  onSubmit: (draft: UniversityDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(university))
  const editing = university !== undefined

  return (
    <DialogForm
      submitLabel={editing ? "Save" : "Add university"}
      canSubmit={isDraftReady(draft, editing)}
      onSubmit={() => onSubmit(draft)}
    >
      <TextField
        label="Name"
        maxLength={UNIVERSITY_LIMITS.name}
        {...text("name")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {editing ? null : (
          <TextField
            label="Slug"
            placeholder="unilag"
            hint="The campus's address on Snacc. It cannot change later."
            maxLength={UNIVERSITY_LIMITS.slug}
            {...text("slug")}
          />
        )}
        <TextField
          label="Acronym"
          placeholder="UNILAG"
          maxLength={UNIVERSITY_LIMITS.acronym}
          {...text("acronym")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="State"
          value={draft.state}
          onChange={(state) => set("state", state)}
          options={STATE_CHOICES}
        />
        <SelectField
          label="Ownership"
          value={draft.ownership}
          onChange={(ownership) => set("ownership", ownership)}
          options={OWNERSHIP_CHOICES}
        />
      </div>
      <FormNote>
        Promotions can be aimed at campuses by state and by who runs them.
      </FormNote>
      <TextField
        label="Motto"
        optional
        maxLength={UNIVERSITY_LIMITS.motto}
        {...text("motto")}
      />
      <TextField
        label="Website"
        optional
        type="url"
        placeholder="https://"
        maxLength={UNIVERSITY_LIMITS.website}
        {...text("website")}
      />
      <TextField
        label="Logo URL"
        optional
        type="url"
        placeholder="https://"
        maxLength={UNIVERSITY_LIMITS.logoUrl}
        {...text("logoUrl")}
      />
    </DialogForm>
  )
}

export function UniversityDialog({
  university,
  trigger,
  disabled,
  onSubmit,
}: {
  university?: AdminUniversity
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: UniversityDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={university ? `Edit ${university.name}` : "Add a university"}
    >
      <UniversityForm university={university} onSubmit={onSubmit} />
    </FormDialog>
  )
}
