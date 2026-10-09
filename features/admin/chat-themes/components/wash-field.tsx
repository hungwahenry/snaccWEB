"use client"

import { X } from "lucide-react"
import { useId } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { WASH_MAX, washOf, washParts } from "../utils/chat-themes"

const ADDED_OPACITY = 20

export function WashField({
  value,
  overPicture,
  onChange,
}: {
  value: string
  overPicture: boolean
  onChange: (value: string) => void
}) {
  const id = useId()
  const { color, opacity } = washParts(value)
  const what = overPicture ? "picture" : "background"

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        Wash
        {overPicture ? null : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </FieldLabel>
      {value.trim() === "" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => onChange(washOf("#000000", ADDED_OPACITY))}
        >
          Add a wash
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <label
            className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border"
            style={{ background: value }}
          >
            <span className="sr-only">Pick the wash colour</span>
            <input
              id={id}
              type="color"
              value={color}
              onChange={(event) =>
                onChange(washOf(event.target.value, opacity))
              }
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </label>
          <Slider
            aria-label="How strong the wash is"
            min={0}
            max={WASH_MAX}
            step={5}
            value={Math.min(opacity, WASH_MAX)}
            onValueChange={(next) =>
              onChange(washOf(color, Array.isArray(next) ? next[0] : next))
            }
            className="flex-1"
          />
          <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
            {opacity}%
          </span>
          {overPicture ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove the wash"
              onClick={() => onChange("")}
            >
              <X />
            </Button>
          )}
        </div>
      )}
      <FieldDescription>
        A see-through tint over the {what} that keeps the bubbles and small
        print readable. Set it for light and dark mode.
      </FieldDescription>
    </Field>
  )
}
