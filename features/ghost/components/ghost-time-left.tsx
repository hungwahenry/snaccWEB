export function GhostTimeLeft({ label }: { label: string | null }) {
  if (!label) return null

  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground tabular-nums">
      {label} left
    </span>
  )
}
