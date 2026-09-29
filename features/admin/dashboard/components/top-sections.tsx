import { Badge } from "@/components/ui/badge"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { formatNumber } from "@/lib/format"
import type { TopReaction } from "../types"

export function TopReactionsSection({
  reactions,
}: {
  reactions: TopReaction[]
}) {
  return (
    <Section title="Top reactions">
      {reactions.length === 0 ? (
        <EmptyNote>No reactions yet.</EmptyNote>
      ) : (
        <div className="flex flex-wrap gap-2 rounded-lg border p-4">
          {reactions.map((reaction) => (
            <Badge
              key={reaction.emoji}
              variant="secondary"
              className="gap-1.5 text-sm"
            >
              <span>{reaction.emoji}</span>
              <span className="tabular-nums">
                {formatNumber(reaction.count)}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </Section>
  )
}
