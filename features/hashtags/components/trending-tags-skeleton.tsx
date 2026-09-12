import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"

const CHIP_WIDTHS = [72, 96, 64, 110, 80, 88, 68, 102]

export function TrendingTagsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">Trending</Eyebrow>
      <div className="flex flex-wrap gap-2 px-1">
        {CHIP_WIDTHS.map((width, i) => (
          <Skeleton key={i} className="h-9 rounded-full" style={{ width }} />
        ))}
      </div>
    </div>
  )
}
