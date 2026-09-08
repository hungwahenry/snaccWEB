import { toast } from "sonner"
import { getQueryClient } from "@/lib/query-client"
import { moneyMoved, walletChanged } from "./hooks/account/use-wallet-cache"
import type { WalletOverview } from "./types"
import {
  LIMITS_KEY,
  REQUESTS_KEY,
  VIRTUAL_ACCOUNT_KEY,
  WALLET_OVERVIEW_KEY,
} from "./utils/keys"

export function onWalletBalance({ balance }: { balance: number }): void {
  // Patch rather than invalidate so the number moves at once; everything derived still refetches.
  getQueryClient().setQueryData<WalletOverview>(WALLET_OVERVIEW_KEY, (old) =>
    old ? { ...old, balance } : old
  )
  moneyMoved()
}

export function onMoneyRequest(): void {
  void getQueryClient().invalidateQueries({ queryKey: REQUESTS_KEY })
}

export function onVirtualAccount(): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({ queryKey: VIRTUAL_ACCOUNT_KEY })
  void queryClient.invalidateQueries({ queryKey: LIMITS_KEY })
}

export function onWithdrawal(withdrawal: { status: string }): void {
  walletChanged()
  if (withdrawal.status === "success")
    toast.success("Your send reached the bank.")
  else if (withdrawal.status === "failed" || withdrawal.status === "reversed") {
    toast.error("The bank send failed — the money is back in your wallet.")
  }
}
