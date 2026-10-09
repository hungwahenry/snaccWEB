"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TextField } from "@/features/admin/shell/components/form-fields"
import type { ChatThemeKind } from "@/features/chat-themes/types"
import type { BackgroundStyle, PaintDraft } from "../types"
import {
  THEME_LIMITS,
  withoutStop,
  withStop,
  withStopColor,
} from "../utils/chat-themes"
import { ColorField } from "./color-field"
import { WashField } from "./wash-field"

type PaintText = Exclude<keyof PaintDraft, "stops" | "style">

const STYLES: { value: BackgroundStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
]

export function PaintEditor({
  paint,
  kind,
  onChange,
}: {
  paint: PaintDraft
  kind: ChatThemeKind
  onChange: (paint: PaintDraft) => void
}) {
  const set = (field: PaintText) => (value: string) =>
    onChange({ ...paint, [field]: value })

  return (
    <div className="flex min-w-0 flex-col gap-5">
      {kind === "preset" ? (
        <FieldSet className="gap-3">
          <FieldLegend variant="label">Background</FieldLegend>
          <ToggleGroup
            aria-label="Background"
            variant="outline"
            size="sm"
            value={[paint.style]}
            onValueChange={(next) => {
              const style = STYLES.find((option) => option.value === next[0])
              if (style) onChange({ ...paint, style: style.value })
            }}
          >
            {STYLES.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {paint.style === "solid" ? (
            <ColorField
              label="Colour"
              value={paint.solid}
              onChange={set("solid")}
            />
          ) : (
            <>
              {paint.stops.map((stop, index) => (
                <ColorField
                  key={index}
                  label={`Colour ${index + 1}`}
                  value={stop}
                  onChange={(color) =>
                    onChange(withStopColor(paint, index, color))
                  }
                  action={
                    paint.stops.length > THEME_LIMITS.stopsMin ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove colour ${index + 1}`}
                        onClick={() => onChange(withoutStop(paint, index))}
                      >
                        <X />
                      </Button>
                    ) : null
                  }
                />
              ))}
              <div className="flex items-end gap-3">
                <TextField
                  label="Angle"
                  inputMode="numeric"
                  value={paint.angle}
                  onChange={(event) => set("angle")(event.target.value)}
                  className="w-24"
                />
                {paint.stops.length < THEME_LIMITS.stopsMax ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange(withStop(paint))}
                  >
                    <Plus />
                    Add colour
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </FieldSet>
      ) : null}

      <WashField
        value={paint.wash}
        overPicture={kind !== "preset"}
        onChange={set("wash")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField
          label="Your bubble"
          value={paint.mineFill}
          onChange={set("mineFill")}
        />
        <ColorField
          label="Your bubble's text"
          value={paint.mineText}
          onChange={set("mineText")}
        />
        <ColorField
          label="Their bubble"
          value={paint.theirsFill}
          onChange={set("theirsFill")}
        />
        <ColorField
          label="Their bubble's text"
          value={paint.theirsText}
          onChange={set("theirsText")}
        />
      </div>

      <ColorField
        label="Small print"
        value={paint.meta}
        onChange={set("meta")}
      />
    </div>
  )
}
