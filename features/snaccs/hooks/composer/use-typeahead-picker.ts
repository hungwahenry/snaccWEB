"use client"

import type { KeyboardEvent } from "react"
import type { CaretText } from "@/hooks/use-caret-text"
import type { EntityKind, TypeaheadSuggestion } from "../../types"
import { useComposerTypeahead } from "./use-composer-typeahead"

export function useTypeaheadPicker(
  text: Pick<CaretText, "body" | "cursor" | "replaceRange">,
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
    handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
      const choice = typeahead.suggestions[typeahead.highlighted]
      if (!typeahead.open || !choice) return

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        typeahead.move(event.key === "ArrowDown" ? 1 : -1)
      } else if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        pick(choice)
      }
    },
  }
}
