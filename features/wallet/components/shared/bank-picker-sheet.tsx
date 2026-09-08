"use client"

import { SearchIcon, SearchXIcon } from "lucide-react"
import { useState } from "react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import type { Bank } from "../../types"

export function BankPickerSheet({
  open,
  onOpenChange,
  banks,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  banks: Bank[]
  onSelect: (bank: Bank) => void
}) {
  const [query, setQuery] = useState("")
  const filtered = query
    ? banks.filter((bank) =>
        bank.name.toLowerCase().includes(query.toLowerCase())
      )
    : banks

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Choose your bank"
      tall
    >
      <div className="px-4 pb-3">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search banks"
            autoCapitalize="none"
            className="h-14 rounded-full pl-11 text-base md:text-base"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title="No bank matches that"
          description="Check the spelling or try a shorter name."
          className="py-16"
        />
      ) : (
        filtered.map((bank) => (
          <button
            key={bank.code}
            type="button"
            onClick={() => onSelect(bank)}
            className="block w-full border-b border-border px-4 py-3.5 text-left text-base text-foreground transition-colors hover:bg-accent/60 active:opacity-60"
          >
            {bank.name}
          </button>
        ))
      )}
    </ActionSheet>
  )
}
