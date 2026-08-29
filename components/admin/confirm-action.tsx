"use client"

import { useState, type ReactElement, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Variant = "default" | "destructive" | "outline" | "ghost"

export function ConfirmAction({
  trigger,
  label,
  icon,
  title,
  description,
  confirmLabel,
  variant = "outline",
  confirmVariant = "destructive",
  size = "sm",
  pending = false,
  disabled = false,
  onConfirm,
}: {
  trigger?: ReactElement
  label?: ReactNode
  icon?: ReactNode
  title: string
  description: ReactNode
  confirmLabel: string
  variant?: Variant
  confirmVariant?: Variant
  size?: "sm" | "default"
  pending?: boolean
  disabled?: boolean
  onConfirm: (close: () => void) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant={variant} size={size} disabled={disabled}>
              {icon}
              {label}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-pretty text-muted-foreground">
          {description}
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant={confirmVariant}
            disabled={pending}
            onClick={() => onConfirm(() => setOpen(false))}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
