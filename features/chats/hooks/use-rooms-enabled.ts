"use client"

import { useFlag } from "@/features/config/hooks/use-flag"

export function useRoomsEnabled(): boolean {
  const campus = useFlag("campus_chat")
  const global = useFlag("global_chat")
  const hangouts = useFlag("hangouts")
  return campus || global || hangouts
}
