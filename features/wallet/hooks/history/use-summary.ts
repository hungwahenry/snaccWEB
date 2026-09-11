"use client"

import { useQuery } from "@tanstack/react-query"
import { getSummary } from "../../api"
import { walletKeys } from "../../utils/keys"

export function useSummary(month: string) {
  return useQuery({
    queryKey: walletKeys.summary(month),
    queryFn: () => getSummary(month),
  })
}
