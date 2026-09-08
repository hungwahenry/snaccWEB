import { getQueryClient } from "@/lib/query-client"
import { EARNINGS_WALLET_KEY } from "./hooks/use-earnings"
import type { Wallet } from "./types"

export function onEarningsWallet({ balance }: { balance: number }): void {
  getQueryClient().setQueryData<Wallet>(EARNINGS_WALLET_KEY, (old) =>
    old ? { ...old, balance } : old
  )
}
