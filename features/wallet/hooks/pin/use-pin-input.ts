"use client"

import { useState } from "react"

export const PIN_LENGTH = 6

/// A six-digit entry. `onComplete` fires from the key press that fills it, with the box wiped.
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
