import { Eyebrow } from "@/components/ui/eyebrow"
import type { SetupRow } from "../types"

export function SetupRows({
  title,
  rows,
}: {
  title: string
  rows: SetupRow[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      <div className="flex flex-col divide-y divide-border/60 rounded-2xl bg-card">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 px-4 py-3">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            {row.lines.map((line) => (
              <span
                key={line}
                className="text-sm font-bold break-words text-foreground"
              >
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
