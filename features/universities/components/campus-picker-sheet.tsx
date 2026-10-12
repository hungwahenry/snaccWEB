"use client"

import { SearchIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { University } from "../types"
import { CampusResults } from "./campus-results"

export function CampusPickerSheet({
  title,
  open,
  onOpenChange,
  search,
  onSearch,
  searching,
  results,
  onSelect,
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  onSearch: (next: string) => void
  searching: boolean
  results: University[]
  onSelect: (university: University) => void
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      tall
    >
      <div className="sticky top-0 z-10 bg-popover px-4 pb-3 sm:px-5">
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search your university"
            autoCorrect="off"
            autoFocus
            className="h-14 rounded-full pr-11 pl-11 text-base md:text-base"
          />
          {searching ? (
            <Spinner className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground" />
          ) : null}
        </div>
      </div>
      <div className="px-2 sm:px-3">
        <CampusResults
          search={search}
          searching={searching}
          results={results}
          onSelect={onSelect}
        />
      </div>
    </ActionSheet>
  )
}
