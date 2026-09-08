"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { PinSheet } from "@/features/wallet/components/pin/pin-sheet"
import { usePinInput } from "@/features/wallet/hooks/pin/use-pin-input"

type PromptPin = (title?: string) => Promise<string | null>

const PinPromptContext = createContext<PromptPin | null>(null)

export function usePinPrompt(): PromptPin {
  const prompt = useContext(PinPromptContext)
  if (!prompt)
    throw new Error("usePinPrompt must be used within PinPromptProvider")
  return prompt
}

export function PinPromptProvider({ children }: { children: ReactNode }) {
  const resolver = useRef<((pin: string | null) => void) | null>(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("Confirm with your PIN")

  const input = usePinInput((pin) => {
    const pending = resolver.current
    resolver.current = null
    setOpen(false)
    pending?.(pin)
  })
  const reset = input.reset

  const prompt = useCallback<PromptPin>(
    (nextTitle) =>
      new Promise<string | null>((resolve) => {
        resolver.current?.(null)
        resolver.current = resolve
        setTitle(nextTitle ?? "Confirm with your PIN")
        reset()
        setOpen(true)
      }),
    [reset]
  )

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) return
    const pending = resolver.current
    resolver.current = null
    pending?.(null)
  }

  return (
    <PinPromptContext.Provider value={prompt}>
      {children}
      <PinSheet
        open={open}
        onOpenChange={onOpenChange}
        value={input.value}
        onKey={input.press}
        title={title}
      />
    </PinPromptContext.Provider>
  )
}
