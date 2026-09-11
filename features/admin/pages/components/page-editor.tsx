"use client"

import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { TextField } from "@/features/admin/shell/components/form-fields"
import type { AdminPage, PageDraft, PageTextKey } from "../types"
import { PAGE_LIMITS, STATUS_CHANGE } from "../utils/page"
import { RichTextEditor } from "./rich-text-editor"

type TextBinding = {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function PageEditor({
  page,
  draft,
  text,
  canSave,
  onBodyChange,
  onSave,
  onToggleStatus,
}: {
  page?: AdminPage
  draft: PageDraft
  text: (key: PageTextKey) => TextBinding
  canSave: boolean
  onBodyChange: (content: unknown, html: string) => void
  onSave: () => Promise<unknown>
  onToggleStatus: () => Promise<unknown>
}) {
  const change = page ? STATUS_CHANGE[page.status] : null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {change ? (
            <CanAct permission="pages.publish">
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    {change.action}
                  </Button>
                }
                title={change.title}
                description={change.description}
                confirmLabel={change.confirmLabel}
                tone={change.tone}
                onConfirm={onToggleStatus}
              />
            </CanAct>
          ) : null}
        </div>
        <CanAct permission="pages.write">
          <ActionButton disabled={!canSave} onClick={onSave}>
            {page ? "Save changes" : "Create page"}
          </ActionButton>
        </CanAct>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Title"
          maxLength={PAGE_LIMITS.title}
          {...text("title")}
        />
        <TextField
          label="Slug"
          placeholder="terms-of-use"
          maxLength={PAGE_LIMITS.slug}
          {...text("slug")}
        />
      </div>

      <TextField
        label="Excerpt"
        optional
        maxLength={PAGE_LIMITS.excerpt}
        {...text("excerpt")}
      />

      <Field>
        <FieldLabel>Body</FieldLabel>
        <RichTextEditor content={draft.content} onChange={onBodyChange} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="SEO title"
          optional
          maxLength={PAGE_LIMITS.seoTitle}
          {...text("seoTitle")}
        />
        <TextField
          label="SEO description"
          optional
          multiline
          rows={2}
          maxLength={PAGE_LIMITS.seoDescription}
          {...text("seoDescription")}
        />
      </div>
    </div>
  )
}
