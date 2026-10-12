import type { ReactNode } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"

export function FormSection({
  title,
  hint,
  problem,
  children,
}: {
  title: string
  hint?: string
  problem?: string | null
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <Eyebrow>{title}</Eyebrow>
        {hint ? (
          <p className="text-[13px] leading-5 text-pretty text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
      {children}
      {problem ? (
        <p role="alert" className="text-sm text-destructive">
          {problem}
        </p>
      ) : null}
    </section>
  )
}

export function FormField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
    </div>
  )
}
