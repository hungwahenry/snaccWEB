"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboard } from "../api"
import { adminDashboardKeys } from "../utils/keys"

export function useDashboard() {
  return useQuery({
    queryKey: adminDashboardKeys.metrics(),
    queryFn: getDashboard,
  })
}
