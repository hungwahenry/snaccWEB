import type { LucideIcon } from "lucide-react"

export function PerkRow({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-foreground" />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="font-bold text-foreground">{title}</span>
        <span className="text-sm leading-5 text-muted-foreground">{text}</span>
      </div>
    </div>
  )
}
