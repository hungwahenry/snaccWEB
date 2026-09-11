"use client"

import type { ReactElement, ReactNode } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import {
  SwitchField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminFeatureFlag, FlagDraft } from "../types"
import {
  draftErrors,
  draftFrom,
  isDraftReady,
  patchRule,
  PLATFORM_LABELS,
  PLATFORMS,
  withRule,
} from "../utils/flags"

function problem(message: string | null): ReactNode {
  return message ? <span className="text-destructive">{message}</span> : null
}

function AvailabilityForm({
  flag,
  onSubmit,
}: {
  flag: AdminFeatureFlag
  onSubmit: (draft: FlagDraft) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => draftFrom(flag))
  const errors = draftErrors(draft)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isDraftReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Oldest build"
          placeholder="1.2.0"
          hint={problem(errors.window.min)}
          {...text("min")}
        />
        <TextField
          label="Newest build"
          placeholder="No limit"
          hint={problem(errors.window.max)}
          {...text("max")}
        />
      </div>

      <fieldset className="flex flex-col gap-3 rounded-lg border p-3">
        <legend className="px-1 text-sm font-medium">Platform rules</legend>
        <FormNote>
          For when the stores fall out of step. A platform with its own rule
          ignores the builds above and follows this instead.
        </FormNote>

        {PLATFORMS.map((platform) => {
          const rule = draft.rules[platform]
          const ruleErrors = errors.rules[platform]
          const label = PLATFORM_LABELS[platform]

          return (
            <div
              key={platform}
              className="flex flex-col gap-3 border-t pt-3 first-of-type:border-t-0 first-of-type:pt-0"
            >
              <SwitchField
                label={`Own rule for ${label}`}
                checked={Boolean(rule)}
                onChange={(wanted) =>
                  set("rules", withRule(draft.rules, platform, wanted))
                }
              />
              {rule ? (
                <div className="flex flex-col gap-3 pl-3">
                  <SwitchField
                    label={`On for ${label}`}
                    checked={rule.enabled}
                    onChange={(enabled) =>
                      set(
                        "rules",
                        patchRule(draft.rules, platform, { enabled })
                      )
                    }
                  />
                  {platform === "web" ? (
                    <FormNote>
                      The web ships continuously, so there is no build to limit.
                    </FormNote>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        label="Oldest build"
                        placeholder="No limit"
                        value={rule.min}
                        hint={problem(ruleErrors?.min ?? null)}
                        onChange={(event) =>
                          set(
                            "rules",
                            patchRule(draft.rules, platform, {
                              min: event.target.value,
                            })
                          )
                        }
                      />
                      <TextField
                        label="Newest build"
                        placeholder="No limit"
                        value={rule.max}
                        hint={problem(ruleErrors?.max ?? null)}
                        onChange={(event) =>
                          set(
                            "rules",
                            patchRule(draft.rules, platform, {
                              max: event.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )
        })}
      </fieldset>

      <FormNote>
        A build only changes when someone installs from a store, so an update
        sent over the air never moves anyone past these. Anything that does not
        say which build it is counts as too old and will not see the feature.
      </FormNote>
    </DialogForm>
  )
}

export function AvailabilityDialog({
  flag,
  trigger,
  disabled,
  onSubmit,
}: {
  flag: AdminFeatureFlag
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: FlagDraft) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={
        <>
          Who gets <span className="font-mono">{flag.key}</span>
        </>
      }
      description="Which app builds this reaches. Leave a field empty for no limit."
    >
      <AvailabilityForm flag={flag} onSubmit={onSubmit} />
    </FormDialog>
  )
}
