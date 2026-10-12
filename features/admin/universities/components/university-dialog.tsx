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
import { useUniversityPlaces } from "../hooks/use-university-places"
import type { AdminUniversity, UniversityDraft } from "../types"
import {
  draftFrom,
  isDraftReady,
  TIME_ZONE_OPTIONS,
  UNIVERSITY_LIMITS,
  withCountry,
} from "../utils/university"

function UniversityForm({
  university,
  onSubmit,
}: {
  university?: AdminUniversity
  onSubmit: (draft: UniversityDraft) => Promise<unknown>
}) {
  const { draft, set, text, replace } = useDraft(() => draftFrom(university))
  const places = useUniversityPlaces(draft.countryCode)
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
        <SearchSelectField
          label="Country"
          value={draft.countryCode || null}
          onChange={(code) => replace((current) => withCountry(current, code))}
          options={places.countries}
          placeholder="Search countries"
          empty="No country by that name."
        />
        <SearchSelectField
          label="Time zone"
          value={draft.timeZone || null}
          onChange={(zone) => set("timeZone", zone)}
          options={TIME_ZONE_OPTIONS}
          placeholder="Search time zones"
          empty="No time zone by that name."
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
      <FormNote>
        Promotions can be aimed at campuses by region and campus type. Hangouts
        on this campus show in its time zone.
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
