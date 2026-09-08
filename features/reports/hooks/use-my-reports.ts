"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listMyReports } from "../api"

export function useMyReports() {
  const { items, ...list } = useInfiniteList(["reports", "mine"], listMyReports)
  return { reports: items, ...list }
}
