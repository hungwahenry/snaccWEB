"use client"

import { useId, type ReactNode } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { hexOf, isColor } from "../utils/chat-themes"

export function ColorField({
  label,
  value,
  onChange,
  optional = false,
  action,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  optional?: boolean
  action?: ReactNode
}) {
  const id = useId()
  const valid = isColor(value)
  const blank = value.trim() === ""

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {optional ? (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        ) : null}
      </FieldLabel>
      <div className="flex items-center gap-2">
        <label
          className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border"
          style={valid ? { background: value.trim() } : undefined}
        >
          <span className="sr-only">Pick {label.toLowerCase()}</span>
          <input
            type="color"
            value={hexOf(value)}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={optional ? "None" : "#FFFFFF"}
          aria-invalid={!valid && !(optional && blank)}
          className="font-mono text-xs"
        />
        {action}
      </div>
    </Field>
  )
}
