"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import type { Option } from "@/features/admin/shell/types"
import type { LegalKind } from "@/features/legal/types"
import { DEFAULT_SET, KIND_OPTIONS } from "../utils/legal"

function NewVersionForm({
  whereOptions,
  onStart,
}: {
  whereOptions: Option[]
  onStart: (kind: LegalKind, where: string) => Promise<unknown>
}) {
  const [kind, setKind] = useState<LegalKind>("terms")
  const [where, setWhere] = useState<string>(DEFAULT_SET)

  return (
    <DialogForm submitLabel="Start draft" onSubmit={() => onStart(kind, where)}>
      <OptionSelect
        label="Document"
        value={kind}
        onChange={(value) => value && setKind(value)}
        options={KIND_OPTIONS}
      />
      <OptionSelect
        label="For"
        value={where}
        onChange={(value) => value && setWhere(value)}
        options={whereOptions}
      />
      <FormNote>
        The draft starts from the version in force, or from the default set when
        this country has none of its own.
      </FormNote>
    </DialogForm>
  )
}

export function NewVersionDialog({
  whereOptions,
  onStart,
}: {
  whereOptions: Option[]
  onStart: (kind: LegalKind, where: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={<Button size="sm">New version</Button>}
      title="New version"
      description="Publishing it later asks everyone it applies to to agree again."
    >
      <NewVersionForm whereOptions={whereOptions} onStart={onStart} />
    </FormDialog>
  )
}
