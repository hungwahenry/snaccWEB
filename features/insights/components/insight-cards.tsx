import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex grow basis-[46%] flex-col gap-2 rounded-2xl bg-card p-4 sm:basis-[30%]">
      <Icon className="size-[18px] text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-extrabold tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function ChartPanel({
  label,
  caption,
  children,
}: {
  label: string
  caption: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <Eyebrow>{label}</Eyebrow>
        <div className="text-[13px] leading-5 text-muted-foreground">
          {caption}
        </div>
      </div>
      <div className="rounded-2xl bg-card p-4">{children}</div>
    </div>
  )
}
