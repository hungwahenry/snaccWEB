"use client"

import type { ReactNode } from "react"
import { useKeyboardInset } from "@/hooks/use-keyboard-inset"
import { cn } from "@/lib/utils"

/// The bar pinned under a composer, inside a ComposerScreen. It drops its safe-area padding while
/// the keyboard is up, because the keyboard already occupies that strip.
export function ComposerBar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const keyboard = useKeyboardInset()

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 mt-auto border-t border-border bg-background",
        keyboard === 0 && "pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      {children}
    </div>
  )
}
