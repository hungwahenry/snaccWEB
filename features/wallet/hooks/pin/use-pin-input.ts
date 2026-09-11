"use client"

import { useState } from "react"
import { PIN_LENGTH, typePin } from "../../utils/pin"

export function usePinInput(onComplete?: (pin: string) => void) {
  const [value, setValue] = useState("")

  function press(key: string) {
    const next = typePin(value, key)
    if (next.length === PIN_LENGTH && onComplete) {
      setValue("")
      onComplete(next)
      return
    }
    setValue(next)
  }

  return { value, press, reset: () => setValue("") }
}
