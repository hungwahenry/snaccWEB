import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

type IconButtonProps = Omit<ComponentProps<"button">, "children"> & {
  icon: LucideIcon
  label: string
  iconClassName?: string
}

export function IconButton({
  icon: Icon,
  label,
  className,
  iconClassName,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent active:scale-95 disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Icon className={cn("size-6", iconClassName)} />
    </button>
  )
}
