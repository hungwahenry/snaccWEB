"use client"

import { useQuery } from "@tanstack/react-query"
import { getTransactionDetail } from "../../api"
import { walletKeys } from "../../utils/keys"

export function useTransactionDetail(id: string | null) {
  return useQuery({
    queryKey: walletKeys.transaction(id ?? ""),
    queryFn: () => getTransactionDetail(id ?? ""),
    enabled: id !== null,
  })
}
