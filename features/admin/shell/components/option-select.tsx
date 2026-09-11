"use client"

import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Option } from "../types"

/**
 * A select that always shows the chosen option's label, never its raw value. With `allLabel` it
 * also offers "no filter", which comes back as null.
 */
export function OptionSelect<V extends string>({
  value,
  onChange,
  options,
  allLabel,
  placeholder,
  label,
  id,
  className,
  disabled,
}: {
  value: V | null
  onChange: (value: V | null) => void
  options: readonly Option<V>[]
  allLabel?: string
  placeholder?: string
  label: string
  id?: string
  className?: string
  disabled?: boolean
}) {
  const items = useMemo(
    () =>
      allLabel === undefined
        ? options
        : [{ value: null, label: allLabel }, ...options],
    [options, allLabel]
  )

  return (
    <Select<V | null>
      id={id}
      value={value}
      items={items}
      disabled={disabled}
      onValueChange={(next) => {
        if (next !== null || allLabel !== undefined) onChange(next)
      }}
    >
      <SelectTrigger aria-label={label} className={cn("w-40", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((option) => (
          <SelectItem key={option.value ?? ""} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
