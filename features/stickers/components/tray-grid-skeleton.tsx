import { Skeleton } from "@/components/ui/skeleton"

const PLACEHOLDER_SHAPES = [
  ["aspect-square", "aspect-4/3", "aspect-square", "aspect-3/4"],
  ["aspect-4/3", "aspect-square", "aspect-3/4", "aspect-square"],
]

export function TrayGridSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-1.5 px-4">
      {PLACEHOLDER_SHAPES.map((column, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          {column.map((shape, row) => (
            <Skeleton key={row} className={shape} />
          ))}
        </div>
      ))}
    </div>
  )
}
