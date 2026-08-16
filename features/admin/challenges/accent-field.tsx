"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function accentCss(from: string, to: string | null) {
  return to ? `linear-gradient(135deg, ${from}, ${to})` : from
}

export function AccentField({
  from,
  to,
  onChange,
}: {
  from: string
  to: string | null
  onChange: (from: string, to: string | null) => void
}) {
  const gradient = to !== null

  return (
    <Field>
      <FieldLabel>Accent</FieldLabel>
      <div className="flex items-center gap-3">
        <div className="h-9 flex-1 rounded-md border" style={{ background: accentCss(from, to) }} />
        <input
          type="color"
          value={from}
          onChange={(event) => onChange(event.target.value, to)}
          aria-label="Accent color"
          className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent"
        />
        {gradient ? (
          <input
            type="color"
            value={to ?? from}
            onChange={(event) => onChange(from, event.target.value)}
            aria-label="Gradient end color"
            className="size-9 shrink-0 cursor-pointer rounded-md border bg-transparent"
          />
        ) : null}
      </div>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <Switch
          checked={gradient}
          onCheckedChange={(on) => onChange(from, on ? (to ?? from) : null)}
        />
        Gradient
      </label>
    </Field>
  )
}
