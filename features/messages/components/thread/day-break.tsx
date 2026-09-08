import { Eyebrow } from "@/components/ui/eyebrow"
import { Squiggle } from "@/components/ui/squiggle"

export function DayBreak({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-2 py-4">
      <Squiggle className="flex-1" />
      <span className="rounded-full bg-muted px-2.5 py-1">
        <Eyebrow>{label}</Eyebrow>
      </span>
      <Squiggle className="flex-1" />
    </div>
  )
}
