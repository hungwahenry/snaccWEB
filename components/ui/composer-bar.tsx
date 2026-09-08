"use client"

import type { ReactNode } from "react"
import { useKeyboardInset } from "@/hooks/use-keyboard-inset"
import { cn } from "@/lib/utils"

export function ComposerBar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const inset = useKeyboardInset()

  return (
    <div
      style={{ bottom: inset }}
      className={cn(
        "sticky z-20 border-t border-border bg-background",
        inset === 0 && "pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      {children}
    </div>
  )
}
