import { EyeIcon } from "lucide-react"

export function GhostBanner({ onReveal }: { onReveal: () => void }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      className="flex w-full items-center gap-2 border-b border-border px-4 py-2.5 text-left transition-opacity active:opacity-70 sm:px-6"
    >
      <EyeIcon className="size-4 text-muted-foreground" />
      <span className="flex-1 text-sm text-muted-foreground">
        You&apos;re anonymous to them.
      </span>
      <span className="text-sm font-bold text-foreground">Reveal</span>
    </button>
  )
}
