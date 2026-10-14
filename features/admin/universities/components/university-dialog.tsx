"use client"

import type { ReactElement } from "react"
import {
  SearchSelectField,
  SelectField,
  SwitchField,
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
  timeZoneOptions,
  UNIVERSITY_LIMITS,
  withCountry,
} from "../utils/university"

function UniversityForm({
  university,
  reviewing,
  onSubmit,
}: {
  university?: AdminUniversity
  reviewing: boolean
  onSubmit: (draft: UniversityDraft) => Promise<unknown>
}) {
  const { draft, set, text, replace } = useDraft(() => draftFrom(university))
  const places = useUniversityPlaces(draft.countryCode)
  const editing = university !== undefined

  return (
    <DialogForm
      submitLabel={reviewing ? "Verify" : editing ? "Save" : "Add campus"}
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
        {university && university.status !== "pending" ? (
          <TextField
            label="Country"
            value={
              places.countries.find(
                (country) => country.value === draft.countryCode
              )?.label ?? draft.countryCode
            }
            onChange={() => undefined}
            readOnly
            hint="A reviewed campus stays in its country. If it's in the wrong one, merge it into the right campus."
          />
        ) : (
          <SearchSelectField
            label="Country"
            value={draft.countryCode || null}
            onChange={(code) =>
              replace((current) => withCountry(current, code))
            }
            options={places.countries}
            placeholder="Search countries"
            empty="No country by that name."
          />
        )}
        <SearchSelectField
          label="Time zone"
          value={draft.timeZone || null}
          onChange={(zone) => set("timeZone", zone)}
          options={timeZoneOptions(draft.timeZone)}
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
      <SwitchField
        label="Open"
        checked={draft.open}
        onChange={(open) => set("open", open)}
        hint="People here get in once its country is open too. Closed, they wait on the list and get an email when it opens."
      />
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
  reviewing = false,
  trigger,
  disabled,
  onSubmit,
}: {
  university?: AdminUniversity
  reviewing?: boolean
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: UniversityDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={
        university
          ? `${reviewing ? "Review" : "Edit"} ${university.name}`
          : "Add a campus"
      }
      description={
        reviewing
          ? "Someone added this campus. Fix its name and details, then verify it. People waiting on it get in and get an email, as long as the campus and its country are open."
          : undefined
      }
    >
      <UniversityForm
        university={university}
        reviewing={reviewing}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
