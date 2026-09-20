"use client"

import { DeleteIcon } from "lucide-react"
import { useEffect, useEffectEvent, useRef } from "react"
import { isTypingField } from "@/lib/keyboard"
import { cn } from "@/lib/utils"

const KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "back",
] as const

const COVERED = "[inert], [aria-hidden='true']"

export type KeypadKey = (typeof KEYS)[number]

export function keypadKey(key: string, decimal: boolean): KeypadKey | null {
  if (key === "Backspace" || key === "Delete") return "back"
  if (key === "." || key === ",") return decimal ? "." : null
  return /^\d$/.test(key) ? (key as KeypadKey) : null
}

export function Keypad({
  onKey,
  decimal = true,
  className,
}: {
  onKey: (key: KeypadKey) => void
  decimal?: boolean
  className?: string
}) {
  const pad = useRef<HTMLDivElement>(null)

  const typed = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (isTypingField(event.target) || pad.current?.closest(COVERED)) return

    const key = keypadKey(event.key, decimal)
    if (!key) return
    event.preventDefault()
    onKey(key)
  })

  useEffect(() => {
    const listen = (event: KeyboardEvent) => typed(event)
    window.addEventListener("keydown", listen)
    return () => window.removeEventListener("keydown", listen)
  }, [])

  return (
    <div
      ref={pad}
      className={cn(
        "mx-auto grid w-full max-w-xs grid-cols-3 px-4 md:max-w-sm",
        className
      )}
    >
      {KEYS.map((key) =>
        key === "." && !decimal ? (
          <span key={key} className="h-16" />
        ) : (
          <button
            key={key}
            type="button"
            onClick={() => onKey(key)}
            aria-label={key === "back" ? "Delete" : key}
            className="flex h-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-foreground transition-colors hover:bg-accent/60 active:opacity-50"
          >
            {key === "back" ? <DeleteIcon className="size-6" /> : key}
          </button>
        )
      )}
    </div>
  )
}
