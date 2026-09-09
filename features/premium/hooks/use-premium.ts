"use client"

import { useQuery } from "@tanstack/react-query"
import { getPremium } from "../api"
import { PREMIUM_KEY } from "../utils/keys"

export function usePremium() {
  return useQuery({ queryKey: PREMIUM_KEY, queryFn: getPremium })
}
