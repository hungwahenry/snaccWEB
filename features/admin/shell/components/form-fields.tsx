"use client"

import { useId, type ChangeEvent, type ReactNode } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Option } from "../types"
import { OptionSelect } from "./option-select"

function labelText(label: ReactNode, optional: boolean) {
  return optional ? (
    <>
      {label}{" "}
      <span className="font-normal text-muted-foreground">(optional)</span>
    </>
  ) : (
    label
  )
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  optional = false,
  multiline = false,
  rows = 3,
  mono = false,
  className,
  ...input
}: {
  label: ReactNode
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  hint?: ReactNode
  optional?: boolean
  multiline?: boolean
  rows?: number
  mono?: boolean
  className?: string
  placeholder?: string
  maxLength?: number
  inputMode?: "text" | "numeric" | "decimal"
  type?: "text" | "url" | "email"
  autoComplete?: string
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{labelText(label, optional)}</FieldLabel>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows}
          aria-describedby={hintId}
          className={cn(mono && "font-mono text-xs")}
          placeholder={input.placeholder}
          maxLength={input.maxLength}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={onChange}
          aria-describedby={hintId}
          className={cn(mono && "font-mono text-xs")}
          {...input}
        />
      )}
      {hint ? <FieldDescription id={hintId}>{hint}</FieldDescription> : null}
    </Field>
  )
}

export function SelectField<V extends string>({
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
  className,
}: {
  label: string
  value: V | null
  onChange: (value: V) => void
  options: readonly Option<V>[]
  placeholder?: string
  hint?: ReactNode
  className?: string
}) {
  const id = useId()

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <OptionSelect
        id={id}
        label={label}
        value={value}
        onChange={(next) => next !== null && onChange(next)}
        options={options}
        placeholder={placeholder}
        className="w-full"
      />
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
    </Field>
  )
}

export function SwitchField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: ReactNode
}) {
  const id = useId()

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {hint ? (
          <p className="text-xs text-pretty text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm">
      <Checkbox
        className="mt-0.5"
        checked={checked}
        onCheckedChange={(next) => onChange(next)}
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span>{label}</span>
        {hint ? (
          <span className="text-xs text-pretty text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  )
}
