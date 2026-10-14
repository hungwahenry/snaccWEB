"use client"

import type { ReactElement } from "react"
import {
  SearchSelectField,
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
import {
  timeZoneOptions,
  UNIVERSITY_LIMITS,
} from "@/features/admin/universities/utils/university"
import type {
  CampusImportRow,
  CampusImportRowEdit,
  CampusImportSource,
} from "../types"
import {
  fileSaid,
  isRowDraftReady,
  linkChoice,
  linkOf,
  linkOptions,
  rowDraft,
  rowEdit,
} from "../utils/campus-imports"

export interface RowPlaces {
  regions: Option[]
  campusTypes: Option[]
}

function RowForm({
  row,
  source,
  places,
  campuses,
  onSave,
}: {
  row: CampusImportRow
  source: CampusImportSource
  places: RowPlaces
  campuses: Option[]
  onSave: (edit: CampusImportRowEdit) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => rowDraft(row))
  const edit = rowEdit(draft, row)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isRowDraftReady(draft) && Object.keys(edit).length > 0}
      onSubmit={() => onSave(edit)}
    >
      <TextField
        label="Name"
        maxLength={UNIVERSITY_LIMITS.name}
        {...text("name")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Short name"
          placeholder="UNILAG"
          maxLength={UNIVERSITY_LIMITS.acronym}
          {...text("acronym")}
        />
        <TextField
          label="Website"
          optional
          type="url"
          placeholder="https://"
          maxLength={UNIVERSITY_LIMITS.website}
          {...text("website")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SearchSelectField
          label="Region"
          value={draft.regionId}
          onChange={(regionId) => set("regionId", regionId)}
          options={places.regions}
          placeholder="Search regions"
          empty="No region by that name."
        />
        <SelectField
          label="Campus type"
          value={draft.campusTypeId}
          onChange={(campusTypeId) => set("campusTypeId", campusTypeId)}
          options={places.campusTypes}
        />
      </div>
      <SearchSelectField
        label="Time zone"
        value={draft.timeZone || null}
        onChange={(zone) => set("timeZone", zone)}
        options={timeZoneOptions(draft.timeZone)}
        placeholder="Search time zones"
        empty="No time zone by that name."
      />
      {source === "file" ? (
        <SearchSelectField
          label="Same as this campus on Snacc"
          value={linkChoice(draft.campusId)}
          onChange={(choice) => set("campusId", linkOf(choice))}
          options={linkOptions(campuses, "None, it's new")}
          placeholder="Search campuses"
          empty="No campus by that name."
          hint="Pick one to update that campus instead of adding a new one."
        />
      ) : (
        <SearchSelectField
          label="Copy of"
          value={linkChoice(draft.mergeIntoId)}
          onChange={(choice) => set("mergeIntoId", linkOf(choice))}
          options={linkOptions(campuses, "Not a copy", row.campus?.id)}
          placeholder="Search campuses"
          empty="No campus by that name."
          hint="Pick the real campus to merge this one into it. Its people, posts and everything else move across."
        />
      )}
      {row.notes.length > 0 ? <FormNote>{row.notes.join(" ")}</FormNote> : null}
    </DialogForm>
  )
}

export function RowDialog({
  row,
  source,
  places,
  campuses,
  trigger,
  disabled,
  onSave,
}: {
  row: CampusImportRow
  source: CampusImportSource
  places: RowPlaces
  campuses: Option[]
  trigger: ReactElement
  disabled?: boolean
  onSave: (edit: CampusImportRowEdit) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={`Row ${row.position}`}
      description={fileSaid(row) ?? undefined}
      wide
    >
      <RowForm
        row={row}
        source={source}
        places={places}
        campuses={campuses}
        onSave={onSave}
      />
    </FormDialog>
  )
}
