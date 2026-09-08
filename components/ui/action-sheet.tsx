"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type ActionSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  hint?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  /// Sheets that hold a long list scroll inside instead of growing past the screen.
  tall?: boolean
}

/// The app's bottom sheet: a drawer on a phone, a centered dialog on a wide screen.
export function ActionSheet({
  open,
  onOpenChange,
  title,
  hint,
  children,
  footer,
  className,
  tall = false,
}: ActionSheetProps) {
  const mobile = useIsMobile()

  if (mobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className={cn(tall && "h-[85dvh]")}>
          {title ? (
            <div className="flex flex-col gap-0.5 px-4 pt-1 pb-2 text-left">
              <DrawerTitle className="text-lg font-extrabold tracking-tight">
                {title}
              </DrawerTitle>
              {hint ? <DrawerDescription>{hint}</DrawerDescription> : null}
            </div>
          ) : (
            <DrawerTitle className="sr-only">Options</DrawerTitle>
          )}
          <div className={cn("min-h-0 flex-1 overflow-y-auto pb-3", className)}>
            {children}
          </div>
          {footer ? (
            <div className="border-t border-border px-4 pt-3 pb-4">
              {footer}
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[85dvh] flex-col gap-0 p-0 sm:max-w-sm",
          tall && "h-[70dvh]"
        )}
      >
        {title ? (
          <div className="flex flex-col gap-0.5 px-5 pt-5 pb-2">
            <DialogTitle className="text-lg font-extrabold tracking-tight">
              {title}
            </DialogTitle>
            {hint ? <DialogDescription>{hint}</DialogDescription> : null}
          </div>
        ) : (
          <DialogTitle className="sr-only">Options</DialogTitle>
        )}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto py-2",
            !title && "pt-3",
            className
          )}
        >
          {children}
        </div>
        {footer ? (
          <div className="border-t border-border px-5 py-4">{footer}</div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type ActionSheetChoiceProps = {
  icon: LucideIcon
  label: string
  hint?: string
  destructive?: boolean
  disabled?: boolean
  onPress: () => void
}

export function ActionSheetChoice({
  icon: Icon,
  label,
  hint,
  destructive = false,
  disabled = false,
  onPress,
}: ActionSheetChoiceProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/60 active:opacity-60 disabled:opacity-50"
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          destructive ? "text-destructive" : "text-foreground"
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-bold",
            destructive ? "text-destructive" : "text-foreground"
          )}
        >
          {label}
        </p>
        {hint ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </button>
  )
}

export function ActionSheetSection({ label }: { label: string }) {
  return (
    <div className="mt-2 border-t border-border pt-3 pb-1">
      <p className="px-5 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}
