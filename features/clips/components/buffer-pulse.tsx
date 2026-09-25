"use client"

import { useWornAccent } from "@/features/appearance/hooks/use-accent"

export function BufferPulse() {
  const accent = useWornAccent()

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 origin-center animate-[clip-buffer_850ms_ease-out_infinite] rounded-full"
      style={{ backgroundColor: accent.dark.primary }}
    />
  )
}
