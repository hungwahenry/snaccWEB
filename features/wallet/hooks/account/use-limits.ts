"use client"

import { useQuery } from "@tanstack/react-query"
import { getLimits } from "../../api"
import { LIMITS_KEY } from "../../utils/keys"

export function useLimits() {
  return useQuery({ queryKey: LIMITS_KEY, queryFn: getLimits })
}
