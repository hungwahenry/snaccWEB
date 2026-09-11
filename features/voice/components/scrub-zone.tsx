"use client"

import type { CSSProperties, PointerEvent, ReactNode, Ref } from "react"
import { cn } from "@/lib/utils"
import { fractionAt, seekByKey } from "../utils/playback"

function pointerFraction(event: PointerEvent<HTMLDivElement>): number {
  return fractionAt(event.clientX, event.currentTarget.getBoundingClientRect())
}

export function ScrubZone({
  measure,
  className,
  style,
  progress,
  valueText,
  onBegin,
  onMove,
  onEnd,
  onCancel,
  children,
}: {
  measure?: Ref<HTMLDivElement>
  className?: string
  style?: CSSProperties
  progress: number
  valueText: string
  onBegin: (fraction: number) => void
  onMove: (fraction: number) => void
  onEnd: (fraction: number) => void
  onCancel: () => void
  children: ReactNode
}) {
  return (
    <div
      ref={measure}
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuetext={valueText}
      className={cn(
        "-my-3 flex cursor-pointer touch-none items-center rounded-md py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={style}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        const next = seekByKey(event.key, progress)
        if (next === null) return
        event.preventDefault()
        event.stopPropagation()
        onEnd(next)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)
        onBegin(pointerFraction(event))
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          onMove(pointerFraction(event))
      }}
      onPointerUp={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        event.currentTarget.releasePointerCapture(event.pointerId)
        onEnd(pointerFraction(event))
      }}
      onPointerCancel={onCancel}
    >
      {children}
    </div>
  )
}
