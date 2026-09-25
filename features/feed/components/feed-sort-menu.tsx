"use client"

import { CheckIcon } from "lucide-react"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { FeedSort } from "../types"
import { FEED_SORTS } from "../utils/sorts"

const MENU_WIDTH = 244

type FeedSortMenuProps = {
  open: boolean
  anchor: HTMLElement | null
  value: FeedSort
  onSelect: (sort: FeedSort) => void
  onDismiss: () => void
}

export function FeedSortMenu({
  open,
  anchor,
  value,
  onSelect,
  onDismiss,
}: FeedSortMenuProps) {
  return (
    <Popover open={open} onOpenChange={(next) => !next && onDismiss()}>
      <PopoverContent
        anchor={anchor}
        side="bottom"
        align="start"
        sideOffset={6}
        aria-label="Sort the feed"
        className="gap-0 rounded-2xl border border-border p-1.5"
        style={{ width: MENU_WIDTH }}
      >
        {FEED_SORTS.map((option) => {
          const active = option.value === value
          const Icon = option.icon
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors outline-none hover:bg-accent/60 focus-visible:bg-accent/60 active:opacity-60",
                active && "bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              />
              <span className="flex-1">
                <span
                  className={cn(
                    "block text-sm text-foreground",
                    active && "font-extrabold"
                  )}
                >
                  {option.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {option.hint}
                </span>
              </span>
              {active ? <CheckIcon className="size-4 text-foreground" /> : null}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
