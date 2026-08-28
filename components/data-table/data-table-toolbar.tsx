"use client"

import { Search, X } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function DataTableToolbar({
  search,
  onSearchChange,
  placeholder = "Search…",
  filters,
  onReset,
  actions,
}: {
  search?: string
  onSearchChange?: (value: string) => void
  placeholder?: string
  filters?: ReactNode
  onReset?: () => void
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onSearchChange && (
        <InputGroup className="w-full max-w-xs">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            value={search ?? ""}
            placeholder={placeholder}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </InputGroup>
      )}
      {filters}
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X />
          Reset
        </Button>
      )}
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </div>
  )
}

export { Input }
