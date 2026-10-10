"use client"

import { useState } from "react"

export function useCaretText(seed = "") {
  const [body, setBody] = useState(seed)
  const [cursor, setCursor] = useState(seed.length)

  return {
    body,
    setBody,
    cursor,
    setCursor,
    replaceRange: (start: number, end: number, text: string) => {
      setBody(
        (current) => `${current.slice(0, start)}${text}${current.slice(end)}`
      )
      setCursor(start + text.length)
    },
  }
}
