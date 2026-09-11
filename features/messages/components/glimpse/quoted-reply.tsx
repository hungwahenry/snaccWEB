import { cn } from "@/lib/utils"
import type { ReplyGlimpse } from "../../types"
import { AttachmentChips } from "./attachment-chips"

/** The message a bubble answers, quoted at its top: who wrote it, its words, and what it carried. */
export function QuotedReply({
  glimpse,
  author,
  onDark,
}: {
  glimpse: ReplyGlimpse
  author?: string | null
  onDark: boolean
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-lg border-l-2 px-2 py-1",
        onDark
          ? "border-primary-foreground/50 bg-black/10"
          : "border-primary bg-black/5"
      )}
    >
      {author ? (
        <span
          className={cn(
            "truncate text-xs font-bold",
            onDark ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {author}
        </span>
      ) : null}
      {glimpse.text ? (
        <span
          className={cn(
            "line-clamp-2 text-xs break-words",
            glimpse.removed && "italic",
            onDark ? "text-primary-foreground/80" : "text-foreground/70"
          )}
        >
          {glimpse.text}
        </span>
      ) : null}
      <AttachmentChips
        chips={glimpse.chips}
        tone={onDark ? "dark" : "bubble"}
      />
    </span>
  )
}
