"use client"

import { useCallback, useState, type ChangeEvent } from "react"

type TextKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

/**
 * The editable copy of a form. `set` changes one field; `text` wires a text input or textarea to
 * a string field in one spread.
 */
export function useDraft<T extends object>(initial: T | (() => T)) {
  const [draft, setDraft] = useState<T>(initial)

  const set = useCallback(
    <K extends keyof T>(key: K, value: T[K]) =>
      setDraft((current) => ({ ...current, [key]: value })),
    []
  )

  const text = useCallback(
    (key: TextKeys<T>) => ({
      value: draft[key] as string,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        set(key, event.target.value as T[typeof key]),
    }),
    [draft, set]
  )

  return { draft, set, text, replace: setDraft }
}
