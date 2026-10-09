"use client"

import { useState, type ReactElement } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { ChatThemeKind } from "@/features/chat-themes/types"
import { ChatThemePreview } from "@/features/messages/components/themes/chat-theme-preview"
import { usePicturePreview } from "../hooks/use-picture-preview"
import type { AdminChatTheme, ChatThemeDraft, LookMode } from "../types"
import {
  draftFrom,
  draftProblem,
  LOOK_MODES,
  paintOfDraft,
  THEME_LIMITS,
  withKind,
} from "../utils/chat-themes"
import { PaintEditor } from "./paint-editor"
import { PictureField } from "./picture-field"

const KINDS: { value: ChatThemeKind; label: string }[] = [
  { value: "preset", label: "Its own background" },
  { value: "image", label: "A picture you upload" },
  { value: "photo", label: "Each person's photo" },
]

const KIND_NOTES: Record<ChatThemeKind, string> = {
  preset: "its own background",
  image: "over its own picture",
  photo: "over each person's photo",
}

const FORM_NOTES: Record<ChatThemeKind, string> = {
  preset:
    "Check both light and dark mode before saving. The wash is an optional tint over the background.",
  image:
    "The same picture sits behind light and dark mode. Use each mode's wash to tint it so the bubbles and small print stay readable.",
  photo:
    "A photo theme sits over the picture each person picks, so the preview shows it over a plain background. The wash tints the photo.",
}

const MODE_LABELS: Record<LookMode, string> = {
  light: "Light mode",
  dark: "Dark mode",
}

function ThemeForm({
  theme,
  onSubmit,
}: {
  theme?: AdminChatTheme
  onSubmit: (draft: ChatThemeDraft) => Promise<unknown>
}) {
  const { draft, set, text, replace } = useDraft(() => draftFrom(theme))
  const [mode, setMode] = useState<LookMode>("light")
  const problem = draftProblem(draft)
  const preview = usePicturePreview(draft.picture)
  const picture = draft.kind === "image" ? (preview ?? draft.pictureUrl) : null

  return (
    <DialogForm
      submitLabel={theme ? "Save" : "Add theme"}
      canSubmit={problem === null}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {theme ? null : (
          <TextField
            label="Key"
            placeholder="berry"
            maxLength={THEME_LIMITS.key}
            mono
            hint="Lowercase letters, numbers and underscores. It can't change later."
            {...text("key")}
          />
        )}
        <TextField
          label="Name in the picker"
          placeholder="Berry"
          maxLength={THEME_LIMITS.label}
          {...text("label")}
        />
        <TextField
          label="Position"
          optional={!theme}
          placeholder="Last"
          inputMode="numeric"
          {...text("position")}
        />
      </div>

      {theme ? null : (
        <Field>
          <FieldLabel>Kind</FieldLabel>
          <ToggleGroup
            aria-label="Kind"
            variant="outline"
            size="sm"
            value={[draft.kind]}
            onValueChange={(next) => {
              const kind = KINDS.find((option) => option.value === next[0])
              if (kind) replace(withKind(draft, kind.value))
            }}
          >
            {KINDS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
      )}

      {draft.kind === "image" ? (
        <PictureField url={picture} onPick={(file) => set("picture", file)} />
      ) : null}

      <ToggleGroup
        aria-label="Mode"
        variant="outline"
        size="sm"
        value={[mode]}
        onValueChange={(next) => {
          const picked = LOOK_MODES.find((option) => option === next[0])
          if (picked) setMode(picked)
        }}
      >
        {LOOK_MODES.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {MODE_LABELS[option]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <PaintEditor
          paint={draft[mode]}
          kind={draft.kind}
          onChange={(paint) => set(mode, paint)}
        />
        <ChatThemePreview
          paint={paintOfDraft(draft[mode], draft.kind)}
          photoUrl={picture}
          className="h-96 rounded-3xl border border-border sm:sticky sm:top-0"
        />
      </div>

      <FormNote>
        {problem ? (
          <span className="text-destructive">{problem}</span>
        ) : (
          FORM_NOTES[draft.kind]
        )}
      </FormNote>
    </DialogForm>
  )
}

export function ThemeDialog({
  theme,
  trigger,
  onSubmit,
}: {
  theme?: AdminChatTheme
  trigger: ReactElement
  onSubmit: (draft: ChatThemeDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      wide
      title={theme ? `Edit ${theme.label}` : "Add a chat theme"}
      description={
        theme
          ? `Key ${theme.key} · ${KIND_NOTES[theme.kind]}`
          : "New themes start switched off, so you can check them before anyone sees them."
      }
    >
      <ThemeForm theme={theme} onSubmit={onSubmit} />
    </FormDialog>
  )
}
