import type { ReactNode } from "react"

export function ChartFrame({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border px-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description ? (
          <p className="text-xs text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
