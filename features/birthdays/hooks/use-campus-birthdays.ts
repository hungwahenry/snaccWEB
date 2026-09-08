"use client"

import { useQuery } from "@tanstack/react-query"
import { HOUR_MS } from "@/lib/duration"
import { getCampusBirthdays } from "../api"

export function useCampusBirthdays() {
  return useQuery({
    queryKey: ["birthdays", "today"],
    queryFn: getCampusBirthdays,
    staleTime: HOUR_MS,
  })
}
