"use client"

import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}) {
  return (
    <InputGroup className={cn("w-full sm:max-w-xs", className)}>
      <InputGroupAddon>
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        aria-label={placeholder}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </InputGroup>
  )
}
