"use client"

import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { RichTextEditor } from "@/features/admin/shell/components/rich-text-editor"
import type { AdminLegalDocument, LegalDraft } from "../types"

type TextBinding = {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function LegalEditor({
  doc,
  draft,
  title,
  canSave,
  canPublish,
  onBodyChange,
  onSave,
  onPublish,
  onDelete,
}: {
  doc: AdminLegalDocument
  draft: LegalDraft
  title: TextBinding
  canSave: boolean
  canPublish: boolean
  onBodyChange: (content: unknown, html: string) => void
  onSave: () => Promise<unknown>
  onPublish: () => Promise<unknown>
  onDelete: () => Promise<unknown>
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CanAct permission="legal.write">
          <ConfirmAction
            trigger={
              <Button variant="ghost" size="sm">
                Delete draft
              </Button>
            }
            title="Delete this draft?"
            description="The version in force stays as it is."
            confirmLabel="Delete draft"
            onConfirm={onDelete}
          />
        </CanAct>
        <div className="flex items-center gap-2">
          <CanAct permission="legal.publish">
            <ConfirmAction
              trigger={
                <Button variant="outline" size="sm" disabled={!canPublish}>
                  Publish
                </Button>
              }
              title={`Publish version ${doc.version}?`}
              description="It saves your changes and takes over from the version in force. Everyone it applies to is asked to agree to it the next time they open Snacc."
              confirmLabel="Publish"
              tone="default"
              onConfirm={onPublish}
            />
          </CanAct>
          <CanAct permission="legal.write">
            <ActionButton disabled={!canSave} onClick={onSave}>
              Save draft
            </ActionButton>
          </CanAct>
        </div>
      </div>

      <TextField label="Title" maxLength={200} {...title} />

      <Field>
        <FieldLabel>Body</FieldLabel>
        <RichTextEditor content={draft.content} onChange={onBodyChange} />
      </Field>
    </div>
  )
}
