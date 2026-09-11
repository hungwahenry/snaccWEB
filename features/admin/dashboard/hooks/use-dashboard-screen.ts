"use client"

import { useDashboard } from "./use-dashboard"

export function useDashboardScreen() {
  return { query: useDashboard() }
}
