"use client"

import { useLayoutEffect, useRef } from "react"

type ComposerInputProps = {
  value: string
  onChange: (next: string) => void
  onCursorChange: (cursor: number) => void
  placeholder: string
  autoFocus?: boolean
}

/// A growing textarea that also reports where the caret is, so @ and # typeahead can follow it.
export function ComposerInput({
  value,
  onChange,
  onCursorChange,
  placeholder,
  autoFocus = true,
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
      onChange={(event) => {
        onChange(event.target.value)
        onCursorChange(event.target.selectionStart ?? event.target.value.length)
      }}
      onSelect={(event) =>
        onCursorChange(
          (event.target as HTMLTextAreaElement).selectionStart ?? 0
        )
      }
      onKeyUp={(event) =>
        onCursorChange(
          (event.target as HTMLTextAreaElement).selectionStart ?? 0
        )
      }
      className="min-h-32 w-full resize-none bg-transparent py-1 text-xl leading-7 font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
    />
  )
}
