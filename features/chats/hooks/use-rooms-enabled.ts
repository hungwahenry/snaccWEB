"use client"

import { useFlag } from "@/features/config/hooks/use-flag"

/** Either room is open. Both flags are read every render: a hook cannot sit behind `||`. */
export function useRoomsEnabled(): boolean {
  const campus = useFlag("campus_chat")
  const global = useFlag("global_chat")
  return campus || global
}
