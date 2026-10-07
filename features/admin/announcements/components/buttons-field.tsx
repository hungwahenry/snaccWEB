"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import type { ButtonDraft } from "../types"
import { counterText } from "../utils/announcement"
import { LIMITS } from "../utils/draft"
import { LINK_OPTIONS, linkHint, URL_MAX } from "../utils/links"

const ORDINALS = ["First button", "Second button"]

export function ButtonsField({
  buttons,
  onAdd,
  onChange,
  onRemove,
}: {
  buttons: ButtonDraft[]
  onAdd: () => void
  onChange: (index: number, patch: Partial<ButtonDraft>) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium">
          Buttons{" "}
          <span className="font-normal text-muted-foreground">
            (optional, up to {LIMITS.buttons})
          </span>
        </p>
        <p className="text-xs text-pretty text-muted-foreground">
          They show under the message when someone opens it.
        </p>
      </div>

      {buttons.map((button, index) => {
        const hint = linkHint(button.url)

        return (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {ORDINALS[index]}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove the ${ORDINALS[index]?.toLowerCase()}`}
                onClick={() => onRemove(index)}
              >
                <X />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Label"
                placeholder="See what's new"
                maxLength={LIMITS.buttonLabel}
                hint={counterText(button.label, LIMITS.buttonLabel)}
                value={button.label}
                onChange={(event) =>
                  onChange(index, { label: event.target.value })
                }
              />
              <SelectField
                label="Takes people to"
                value={button.link}
                placeholder="Pick a place"
                options={LINK_OPTIONS}
                onChange={(link) => onChange(index, { link })}
              />
            </div>
            {button.link === "other" ? (
              <TextField
                label="Link"
                type="url"
                placeholder="https://"
                maxLength={URL_MAX}
                autoComplete="off"
                hint={
                  hint.problem ? (
                    <span className="text-destructive">{hint.text}</span>
                  ) : (
                    hint.text
                  )
                }
                value={button.url}
                onChange={(event) =>
                  onChange(index, { url: event.target.value })
                }
              />
            ) : null}
          </div>
        )
      })}

      {buttons.length < LIMITS.buttons ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={onAdd}
        >
          <Plus />
          Add a button
        </Button>
      ) : null}
    </div>
  )
}
