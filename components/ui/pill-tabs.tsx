"use client"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, type LucideIcon } from "lucide-react"

export type PillTab<T extends string> = {
  value: T
  label: string
  icon?: LucideIcon
}

type PillTabsProps<T extends string> = {
  tabs: PillTab<T>[]
  value: T
  onChange: (value: T) => void
  onReselect?: (value: T) => void
  divider?: boolean
  className?: string
}

export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  onReselect,
  divider = true,
  className,
}: PillTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden",
        divider && "border-b border-border",
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value
        const Icon = tab.icon

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() =>
              active && onReselect ? onReselect(tab.value) : onChange(tab.value)
            }
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-extrabold transition-opacity active:opacity-70",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {Icon ? <Icon className="size-4" /> : null}
            {tab.label}
            {active && onReselect ? (
              <ChevronDownIcon className="-mr-1 size-3.5 opacity-70" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
