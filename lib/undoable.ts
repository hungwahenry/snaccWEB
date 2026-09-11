import { showError, showUndo } from "./feedback"

interface Undoable {
  message: string
  /** Starts the server change. The local change is already on screen. */
  commit: () => Promise<unknown>
  /** Puts the local change back. */
  revert: () => void
  /** Reverses the server change once it has landed. */
  undo: () => Promise<unknown>
}

/** Commits a change already shown on screen, offering Undo until the toast goes. */
export function commitWithUndo({
  message,
  commit,
  revert,
  undo,
}: Undoable): void {
  let undone = false
  const committing = commit()

  const dismiss = showUndo(message, () => {
    undone = true
    revert()
    void committing.then(undo).catch(() => undefined)
  })

  committing.catch((error: unknown) => {
    dismiss()
    if (undone) return
    revert()
    showError(error)
  })
}
