"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { getMyScore } from "../api"

export const MY_SCORE_KEY = ["score", "me"]

export function useMyScore() {
  const enabled = useFlag("score")
  return useQuery({ queryKey: MY_SCORE_KEY, queryFn: getMyScore, enabled })
}
