"use client"

import { useQuery } from "@tanstack/react-query"
import { getTransactionDetail } from "../../api"

export function useTransactionDetail(id: string | null) {
  return useQuery({
    queryKey: ["wallet", "transactions", id],
    queryFn: () => getTransactionDetail(id!),
    enabled: id !== null,
  })
}
