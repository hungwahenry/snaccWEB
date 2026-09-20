const FIELDS = "input, textarea, select, [contenteditable='true']"
const BUSY = `${FIELDS}, [role='dialog'], [role='menu'], [role='listbox'], [role='slider']`

export function isBusyWithKeys(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(BUSY) !== null
}

export function isTypingField(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(FIELDS) !== null
}
