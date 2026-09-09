"use client"

import type { ReactNode } from "react"
import { useKeyboardInset } from "@/hooks/use-keyboard-inset"
import { cn } from "@/lib/utils"

export function ComposerScreen({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const keyboard = useKeyboardInset()

  return (
    <div
      style={{ height: `calc(100dvh - ${keyboard}px)` }}
      className={cn("flex flex-col", className)}
    >
      {children}
    </div>
  )
}
