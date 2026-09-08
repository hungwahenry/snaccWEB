import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

type BackHeaderProps = {
  title: string
  subtitle?: string
  onBack: () => void
  right?: ReactNode
  divider?: boolean
  className?: string
}

export function BackHeader({
  title,
  subtitle,
  onBack,
  right,
  divider = true,
  className,
}: BackHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3 bg-background/90 px-3 backdrop-blur",
        divider && "border-b border-border",
        className
      )}
    >
      <IconButton icon={ArrowLeftIcon} label="Back" onClick={onBack} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right ? (
        <div className="flex shrink-0 items-center gap-1">{right}</div>
      ) : null}
    </header>
  )
}
