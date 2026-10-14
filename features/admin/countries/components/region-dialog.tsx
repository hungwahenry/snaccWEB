"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import type { AdminRegion, RegionInput } from "../types"
import { parentOptions, toRegionInput, TOP_LEVEL } from "../utils/places"

function RegionForm({
  region,
  regions,
  onSubmit,
}: {
  region?: AdminRegion
  regions: AdminRegion[]
  onSubmit: (input: RegionInput) => Promise<unknown>
}) {
  const [name, setName] = useState(region?.name ?? "")
  const [parent, setParent] = useState(region?.parent_id ?? TOP_LEVEL)
  const input = toRegionInput(name, parent)

  return (
    <DialogForm
      submitLabel={region ? "Save" : "Add region"}
      canSubmit={input !== null}
      onSubmit={() => (input ? onSubmit(input) : undefined)}
    >
      <TextField
        label="Name"
        placeholder="Northern Region"
        maxLength={100}
        value={name}
        onChange={(event) => setName(event.target.value)}
        hint="Campus imports match regions by this name, so use the spelling the country's own lists use."
      />
      <SelectField
        label="Inside"
        value={parent}
        onChange={setParent}
        options={parentOptions(regions, region)}
        hint="Pick a larger region when this one sits inside it, like a state inside a zone. Promotions aimed at the larger region reach this one too."
      />
    </DialogForm>
  )
}

export function RegionDialog({
  region,
  regions,
  trigger,
  disabled,
  onSubmit,
}: {
  region?: AdminRegion
  regions: AdminRegion[]
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: RegionInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={region ? `Edit ${region.name}` : "Add a region"}
    >
      <RegionForm region={region} regions={regions} onSubmit={onSubmit} />
    </FormDialog>
  )
}
