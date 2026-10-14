"use client"

import type { ComponentProps, ReactElement } from "react"
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
import type {
  AdminConfigSetting,
  ConfigDraft,
  ConfigValueParse,
  ConfigValueKind,
} from "../types"
import {
  checkDraft,
  checkPremium,
  defaultDraft,
  draftFrom,
  hasPremium,
  isDraftReady,
  previewValue,
  valueKind,
  wantsWholeNumber,
} from "../utils/config"

function ValueField({
  label,
  kind,
  whole,
  check,
  hint,
  ...input
}: {
  label: string
  kind: ConfigValueKind
  whole: boolean
  check: ConfigValueParse
  hint?: string
} & Pick<ComponentProps<typeof TextField>, "value" | "onChange">) {
  return (
    <TextField
      label={kind === "json" ? `${label} (JSON)` : label}
      multiline={kind === "json"}
      rows={8}
      mono={kind === "json"}
      inputMode={
        kind === "number" ? (whole ? "numeric" : "decimal") : undefined
      }
      hint={
        check.ok ? (
          (hint ??
          (kind === "number" && whole
            ? "A whole number of 0 or more."
            : undefined))
        ) : (
          <span className="text-destructive">{check.message}</span>
        )
      }
      {...input}
    />
  )
}

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
  const premiumCheck = checkPremium(setting, draft)
  const shipped = previewValue(setting.default_value)
  const shippedPremium = hasPremium(setting)
    ? previewValue(setting.premium_default)
    : null

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
        <ValueField
          label={premiumCheck ? "Everyone else" : "Value"}
          kind={kind}
          whole={whole}
          check={check}
          {...text("text")}
        />
      )}
      {premiumCheck ? (
        <ValueField
          label="Premium"
          kind={kind}
          whole={whole}
          check={premiumCheck}
          hint="What Premium subscribers get instead."
          {...text("premium")}
        />
      ) : null}
      {setting.is_default || setting.default_value === null ? null : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <FormNote>
            Shipped as{" "}
            <code className="break-all text-foreground">
              {shipped ?? "an empty value"}
            </code>
            {shippedPremium === null ? null : (
              <>
                , Premium{" "}
                <code className="break-all text-foreground">
                  {shippedPremium}
                </code>
              </>
            )}
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
