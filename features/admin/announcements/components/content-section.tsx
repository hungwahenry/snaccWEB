"use client"

import { Section } from "@/features/admin/shell/components/detail"
import { TextField } from "@/features/admin/shell/components/form-fields"
import type { AnnouncementEditorState } from "../hooks/use-announcement-editor"
import type { EditorStage } from "../types"
import { counterText, withDraftNote } from "../utils/announcement"
import { LIMITS } from "../utils/draft"
import { ButtonsField } from "./buttons-field"
import { ImageField } from "./image-field"

const STAGE_NOTES: Partial<Record<EditorStage, string>> = {
  sent: "Changes update everyone's notifications. Pushes already delivered can't change.",
  sending:
    "It's going out right now. You can change the wording once it has gone.",
}

export function ContentSection({
  editor,
}: {
  editor: AnnouncementEditorState
}) {
  const { draft, announcement, stage, can } = editor

  return (
    <Section title="Content" description={STAGE_NOTES[stage]}>
      <fieldset
        disabled={!can.editContent}
        className="flex min-w-0 flex-col gap-4 rounded-lg border p-4"
      >
        <TextField
          label="Title"
          maxLength={LIMITS.title}
          hint={counterText(draft.title, LIMITS.title)}
          {...editor.text("title")}
        />
        <TextField
          label="Message"
          multiline
          rows={5}
          maxLength={LIMITS.message}
          hint={counterText(draft.message, LIMITS.message)}
          {...editor.text("message")}
        />
        <ImageField
          imageUrl={announcement?.image?.url ?? null}
          disabled={!editor.canAttach}
          hint={withDraftNote(
            "Shows at the top when they open it. Wide images work best.",
            stage,
            editor.ready
          )}
          onUpload={editor.uploadImage}
          onRemove={editor.removeImage}
        />
        <ButtonsField
          buttons={draft.buttons}
          onAdd={editor.addButton}
          onChange={editor.setButton}
          onRemove={editor.removeButton}
        />
      </fieldset>
    </Section>
  )
}
