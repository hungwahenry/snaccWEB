"use client"

import { useState } from "react"

export const PIN_LENGTH = 6

export function usePinInput(onComplete?: (pin: string) => void) {
  const [value, setValue] = useState("")

  function press(key: string) {
    const next =
      key === "back"
        ? value.slice(0, -1)
        : value.length >= PIN_LENGTH
          ? value
          : value + key
    if (next.length === PIN_LENGTH && onComplete) {
      setValue("")
      onComplete(next)
      return
    }
    setValue(next)
  }

  return { value, press, reset: () => setValue("") }
}
