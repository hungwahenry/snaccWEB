import { cn } from "@/lib/utils"

export interface Bar {
  key: string
  value: number
  label?: string
}

const HEIGHT = 108
const FLOOR = 2

export function BarChart({ bars, accent }: { bars: Bar[]; accent?: boolean }) {
  const peak = Math.max(...bars.map((bar) => bar.value), 1)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-[2px]" style={{ height: HEIGHT }}>
        {bars.map((bar) => (
          <div
            key={bar.key}
            className={cn(
              "flex-1 rounded-sm",
              bar.value === peak
                ? accent
                  ? "bg-premium"
                  : "bg-primary"
                : accent
                  ? "bg-premium/35"
                  : "bg-primary/25"
            )}
            style={{ height: Math.max((bar.value / peak) * HEIGHT, FLOOR) }}
          />
        ))}
      </div>

      <div className="flex gap-[2px]">
        {bars.map((bar) => (
          <div key={bar.key} className="flex flex-1 justify-center">
            {bar.label ? (
              <span className="text-[10px] text-muted-foreground">
                {bar.label}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
