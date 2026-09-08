import { Eyebrow } from "@/components/ui/eyebrow"

export function DayBreak({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-2 py-4">
      <span className="h-px flex-1 border-t border-dashed border-border" />
      <span className="rounded-full bg-muted px-2.5 py-1">
        <Eyebrow>{label}</Eyebrow>
      </span>
      <span className="h-px flex-1 border-t border-dashed border-border" />
    </div>
  )
}
