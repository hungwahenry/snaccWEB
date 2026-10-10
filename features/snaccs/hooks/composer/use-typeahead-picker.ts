"use client"

import type { KeyboardEvent } from "react"
import type { EntityKind, TypeaheadSuggestion } from "../../types"
import { useComposerTypeahead } from "./use-composer-typeahead"

interface CaretText {
  body: string
  cursor: number
  replaceRange: (start: number, end: number, text: string) => void
}

export function useTypeaheadPicker(
  text: CaretText,
  kinds: readonly EntityKind[]
) {
  const typeahead = useComposerTypeahead(text.body, text.cursor, kinds)

  function pick(suggestion: TypeaheadSuggestion) {
    if (!typeahead.token) return
    text.replaceRange(
      typeahead.token.start,
      typeahead.token.end,
      suggestion.replacement
    )
  }

  return {
    suggestions: typeahead.open
      ? {
          suggestions: typeahead.suggestions,
          loading: typeahead.loading,
          highlighted: typeahead.highlighted,
          onPick: pick,
        }
      : null,
    handleKey(event: KeyboardEvent<HTMLTextAreaElement>): boolean {
      const choice = typeahead.suggestions[typeahead.highlighted]
      if (!typeahead.open || !choice) return false

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        typeahead.move(event.key === "ArrowDown" ? 1 : -1)
        return true
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        pick(choice)
        return true
      }
      return false
    },
  }
}
