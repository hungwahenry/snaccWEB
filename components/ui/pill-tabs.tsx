"use client"

import { ChevronDownIcon, type LucideIcon } from "lucide-react"
import type { KeyboardEvent } from "react"
import { badgeCount } from "@/lib/format"
import { cn } from "@/lib/utils"

export type PillTab<T extends string> = {
  value: T
  label: string
  icon?: LucideIcon
  /** Shown as a small pill when above zero: how much is waiting behind this tab. */
  count?: number
}

type PillTabsProps<T extends string> = {
  tabs: PillTab<T>[]
  value: T
  onChange: (value: T) => void
  onReselect?: (value: T, anchor: HTMLElement) => void
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
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (step === 0) return
    event.preventDefault()

    const index = tabs.findIndex((tab) => tab.value === value)
    const next = (index + step + tabs.length) % tabs.length
    onChange(tabs[next].value)
    const buttons =
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons[next]?.focus()
  }

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
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
            tabIndex={active ? 0 : -1}
            onClick={(event) =>
              active && onReselect
                ? onReselect(tab.value, event.currentTarget)
                : onChange(tab.value)
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
            {tab.count ? (
              <span
                aria-label={`${tab.count} unread`}
                className={cn(
                  "min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold tabular-nums",
                  active
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {badgeCount(tab.count)}
              </span>
            ) : null}
            {active && onReselect ? (
              <ChevronDownIcon className="-mr-1 size-3.5 opacity-70" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
