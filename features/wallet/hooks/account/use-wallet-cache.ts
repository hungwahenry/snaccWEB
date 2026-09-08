import { getQueryClient } from "@/lib/query-client"
import type { WalletOverview } from "../../types"
import {
  LIMITS_KEY,
  RECIPIENTS_KEY,
  SUMMARY_KEY,
  WALLET_OVERVIEW_KEY,
  WALLET_TRANSACTIONS_KEY,
} from "../../utils/keys"

export function moneyMoved(): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({ queryKey: WALLET_TRANSACTIONS_KEY })
  void queryClient.invalidateQueries({ queryKey: RECIPIENTS_KEY })
  void queryClient.invalidateQueries({ queryKey: LIMITS_KEY })
  void queryClient.invalidateQueries({ queryKey: SUMMARY_KEY })
}

export function walletChanged(overview?: WalletOverview): void {
  const queryClient = getQueryClient()
  if (overview)
    queryClient.setQueryData<WalletOverview>(WALLET_OVERVIEW_KEY, overview)
  else void queryClient.invalidateQueries({ queryKey: WALLET_OVERVIEW_KEY })
  moneyMoved()
}
