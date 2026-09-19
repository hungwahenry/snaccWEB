"use client"

import { ImagePlusIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useImageDrop } from "@/hooks/use-image-drop"
import { useKeyboardInset } from "@/hooks/use-keyboard-inset"
import { cn } from "@/lib/utils"

export function ComposerScreen({
  children,
  className,
  onImageFiles,
}: {
  children: ReactNode
  className?: string
  onImageFiles?: (files: File[]) => void
}) {
  const keyboard = useKeyboardInset()
  const drop = useImageDrop(onImageFiles)

  return (
    <div
      {...drop.handlers}
      style={{
        height: `calc(100dvh - ${keyboard}px - var(--now-playing-height))`,
      }}
      className={cn("flex flex-col", className)}
    >
      {children}
      {drop.over ? <DropHint /> : null}
    </div>
  )
}

export function DropHint() {
  return (
    <div className="pointer-events-none fixed inset-2 z-50 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary bg-background/85 backdrop-blur-sm">
      <ImagePlusIcon className="size-8 text-primary" />
      <p className="text-base font-bold text-foreground">Drop photos to add</p>
    </div>
  )
}
