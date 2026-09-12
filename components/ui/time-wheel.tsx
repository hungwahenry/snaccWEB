"use client"

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import type { WheelOption } from "@/lib/calendar"
import { cn } from "@/lib/utils"

const ROW_PX = 44
const SETTLE_MS = 120

export function WheelGroup({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex gap-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[88px] h-11 rounded-xl bg-muted"
      />
      {children}
    </div>
  )
}

export function TimeWheel<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: WheelOption<T>[]
  value: T
  onChange: (value: T) => void
}) {
  const id = useId()
  const list = useRef<HTMLDivElement>(null)
  const settle = useRef<number | undefined>(undefined)
  const placed = useRef(false)
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )

  useLayoutEffect(() => {
    const node = list.current
    if (!node) return
    const top = index * ROW_PX
    if (Math.abs(node.scrollTop - top) >= 1)
      node.scrollTo({ top, behavior: placed.current ? "smooth" : "auto" })
    placed.current = true
  }, [index])

  useEffect(() => () => window.clearTimeout(settle.current), [])

  function onScroll() {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      const node = list.current
      if (!node) return
      const next = options[Math.round(node.scrollTop / ROW_PX)]
      if (next && next.value !== value) onChange(next.value)
    }, SETTLE_MS)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const move =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0
    if (move === 0) return
    event.preventDefault()
    const next = options[index + move]
    if (next) onChange(next.value)
  }

  return (
    <div
      ref={list}
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${id}-${index}`}
      tabIndex={0}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      className="relative h-[220px] flex-1 snap-y snap-mandatory [scrollbar-width:none] overflow-y-auto overscroll-contain rounded-xl [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 [&::-webkit-scrollbar]:hidden"
    >
      <div className="py-[88px]">
        {options.map((option, position) => (
          <div
            key={String(option.value)}
            id={`${id}-${position}`}
            role="option"
            aria-selected={position === index}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-11 cursor-pointer snap-center items-center justify-center text-lg tabular-nums transition-colors",
              position === index
                ? "font-extrabold text-foreground"
                : "text-muted-foreground"
            )}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}
