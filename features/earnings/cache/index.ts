import { getQueryClient } from "@/lib/query/client"
import type { EarningsBalance } from "../types"
import { earningsKeys } from "../utils/keys"

export function earningsChanged(): void {
  void getQueryClient().invalidateQueries({ queryKey: earningsKeys.all() })
}

export function earningsBalanceChanged(balance: number): void {
  getQueryClient().setQueryData<EarningsBalance>(
    earningsKeys.balance(),
    (old) => (old ? { ...old, balance } : old)
  )
}
