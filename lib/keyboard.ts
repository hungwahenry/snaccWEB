const BUSY =
  "input, textarea, select, [contenteditable='true'], [role='dialog'], [role='menu'], [role='listbox'], [role='slider']"

export function isBusyWithKeys(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(BUSY) !== null
}
