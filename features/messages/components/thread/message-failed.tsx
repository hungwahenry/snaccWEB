/** Under a message that did not go: try again, or drop it. */
export function MessageFailed({
  onRetry,
  onDiscard,
}: {
  onRetry: () => void
  onDiscard: () => void
}) {
  return (
    <div className="mt-1 flex items-center gap-3 pr-1 text-[11px]">
      <span className="text-destructive">Not sent</span>
      <button
        type="button"
        onClick={onRetry}
        className="font-bold text-foreground"
      >
        Retry
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="text-muted-foreground"
      >
        Discard
      </button>
    </div>
  )
}
