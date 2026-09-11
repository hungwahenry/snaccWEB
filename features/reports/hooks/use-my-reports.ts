"use client"

import { useQuery } from "@tanstack/react-query"
import { getMyReports } from "../api"
import { reportKeys } from "../utils/keys"

export function useMyReports() {
  return useQuery({ queryKey: reportKeys.mine(), queryFn: getMyReports })
}
