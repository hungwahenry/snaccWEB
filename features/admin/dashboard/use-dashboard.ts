"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboard } from "./index"

export function useDashboard() {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: getDashboard })
}
