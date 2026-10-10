"use client"

import { useLayoutEffect, useRef, type KeyboardEvent } from "react"
import { caretTracking } from "@/lib/caret"

type ComposerInputProps = {
  value: string
  onChange: (next: string) => void
  onCursorChange: (cursor: number) => void
  placeholder: string
  autoFocus?: boolean
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

export function ComposerInput({
  value,
  onChange,
  onCursorChange,
  placeholder,
  autoFocus = true,
  onKeyDown,
}: ComposerInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    node.style.height = "0px"
    node.style.height = `${Math.max(node.scrollHeight, 128)}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      {...caretTracking(onChange, onCursorChange)}
      className="min-h-32 w-full resize-none bg-transparent py-1 text-xl leading-7 font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
    />
  )
}
