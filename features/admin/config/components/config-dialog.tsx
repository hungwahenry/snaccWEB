"use client"

import type { ReactElement } from "react"
import { Button } from "@/components/ui/button"
import {
  SwitchField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminConfigSetting, ConfigDraft } from "../types"
import {
  checkDraft,
  defaultDraft,
  draftFrom,
  isDraftReady,
  previewValue,
  valueKind,
  wantsWholeNumber,
} from "../utils/config"

function ConfigForm({
  setting,
  onSubmit,
}: {
  setting: AdminConfigSetting
  onSubmit: (draft: ConfigDraft) => Promise<unknown>
}) {
  const { draft, set, text, replace } = useDraft(() => draftFrom(setting))
  const kind = valueKind(setting.value)
  const whole = wantsWholeNumber(setting)
  const check = checkDraft(setting, draft)
  const shipped = previewValue(setting.default_value)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isDraftReady(setting, draft)}
      onSubmit={() => onSubmit(draft)}
    >
      {kind === "boolean" ? (
        <SwitchField
          label="On"
          hint={draft.on ? "The setting is on." : "The setting is off."}
          checked={draft.on}
          onChange={(on) => set("on", on)}
        />
      ) : (
        <TextField
          label={kind === "json" ? "Value (JSON)" : "Value"}
          multiline={kind === "json"}
          rows={8}
          mono={kind === "json"}
          inputMode={
            kind === "number" ? (whole ? "numeric" : "decimal") : undefined
          }
          hint={
            check.ok ? (
              kind === "number" && whole ? (
                "A whole number of 0 or more."
              ) : undefined
            ) : (
              <span className="text-destructive">{check.message}</span>
            )
          }
          {...text("text")}
        />
      )}
      {setting.is_default || setting.default_value === null ? null : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <FormNote>
            Shipped as{" "}
            <code className="break-all text-foreground">
              {shipped ?? "an empty value"}
            </code>
          </FormNote>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => replace(defaultDraft(setting, draft))}
          >
            Use the default
          </Button>
        </div>
      )}
      <SwitchField
        label="Public"
        hint="Sent to the apps, so anyone can read it. Keep anything secret private."
        checked={draft.isPublic}
        onChange={(isPublic) => set("isPublic", isPublic)}
      />
    </DialogForm>
  )
}

export function ConfigDialog({
  setting,
  trigger,
  disabled,
  onSubmit,
}: {
  setting: AdminConfigSetting
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: ConfigDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={
        <>
          Edit <span className="font-mono">{setting.key}</span>
        </>
      }
      description={setting.description}
    >
      <ConfigForm setting={setting} onSubmit={onSubmit} />
    </FormDialog>
  )
}
