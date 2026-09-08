"use client"

import { useQuery } from "@tanstack/react-query"
import { getSummary } from "../../api"
import { SUMMARY_KEY } from "../../utils/keys"

export function useSummary(month: string) {
  return useQuery({
    queryKey: [...SUMMARY_KEY, month],
    queryFn: () => getSummary(month),
  })
}
