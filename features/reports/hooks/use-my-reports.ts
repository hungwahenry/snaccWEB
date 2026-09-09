"use client"

import { useQuery } from "@tanstack/react-query"
import { listMyReports } from "../api"

export function useMyReports() {
  return useQuery({ queryKey: ["reports", "mine"], queryFn: listMyReports })
}
