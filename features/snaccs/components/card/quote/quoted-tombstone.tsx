import { EyeOffIcon, GhostIcon } from "lucide-react"

const COPY = {
  deleted: { icon: GhostIcon, text: "The original post was deleted" },
  unavailable: { icon: EyeOffIcon, text: "This post isn't available" },
} as const

export function QuotedTombstone({
  reason,
}: {
  reason: "deleted" | "unavailable"
}) {
  const { icon: Icon, text } = COPY[reason]

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border p-3">
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}
