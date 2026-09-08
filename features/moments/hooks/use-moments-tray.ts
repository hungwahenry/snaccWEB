"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { getTray } from "../api"
import { MOMENTS_TRAY_KEY } from "../utils/keys"

export function useMomentsTray() {
  const enabled = useFlag("moments")

  return useQuery({
    queryKey: MOMENTS_TRAY_KEY,
    queryFn: getTray,
    enabled,
    staleTime: 30_000,
  })
}
