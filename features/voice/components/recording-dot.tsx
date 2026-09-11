/** The red light that pulses while a voice note records. */
export function RecordingDot() {
  return (
    <span
      aria-hidden
      className="size-2.5 shrink-0 animate-pulse rounded-full bg-destructive"
    />
  )
}
