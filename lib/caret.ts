import type { ChangeEvent, SyntheticEvent } from "react"

export function caretTracking(
  onChange: (next: string) => void,
  onCursorChange: (cursor: number) => void
) {
  const report = (event: SyntheticEvent<HTMLTextAreaElement>) =>
    onCursorChange(event.currentTarget.selectionStart ?? 0)

  return {
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value)
      onCursorChange(event.target.selectionStart ?? event.target.value.length)
    },
    onSelect: report,
    onKeyUp: report,
  }
}
