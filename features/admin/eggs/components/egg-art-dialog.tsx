"use client"

import { useId, useState, type ReactElement } from "react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import type { AdminEgg } from "../types"
import { EggMark } from "./egg-mark"

function EggArtForm({
  egg,
  onUpload,
  onRemove,
}: {
  egg: AdminEgg
  onUpload: (file: File) => Promise<unknown>
  onRemove: () => Promise<unknown>
}) {
  const [file, setFile] = useState<File | null>(null)
  const id = useId()

  return (
    <DialogForm
      submitLabel="Upload"
      canSubmit={file !== null}
      onSubmit={() => (file ? onUpload(file) : undefined)}
    >
      <div className="flex items-center gap-4">
        <EggMark egg={egg} className="size-24" />
        {egg.image_url ? (
          <ActionButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            Remove artwork
          </ActionButton>
        ) : (
          <p className="text-sm text-pretty text-muted-foreground">
            No artwork yet, so the reveal card shows the plain shape for its
            rarity.
          </p>
        )}
      </div>
      <Field>
        <FieldLabel htmlFor={id}>New artwork</FieldLabel>
        <Input
          id={id}
          type="file"
          accept="image/*"
          aria-describedby={`${id}-hint`}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <FieldDescription id={`${id}-hint`}>
          Square works best. It shows at 512px on the reveal card.
        </FieldDescription>
      </Field>
    </DialogForm>
  )
}

export function EggArtDialog({
  egg,
  trigger,
  disabled,
  onUpload,
  onRemove,
}: {
  egg: AdminEgg
  trigger: ReactElement
  disabled?: boolean
  onUpload: (file: File) => Promise<unknown>
  onRemove: () => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={`Artwork for ${egg.name}`}
    >
      <EggArtForm egg={egg} onUpload={onUpload} onRemove={onRemove} />
    </FormDialog>
  )
}
