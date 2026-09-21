"use client"

import { useFlag } from "@/features/config/hooks/use-flag"

export function useCanHost(): boolean {
  const hangouts = useFlag("hangouts")
  const hosting = useFlag("hangout_hosting")

  return hangouts && hosting
}
