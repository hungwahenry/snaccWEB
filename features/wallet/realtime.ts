import { showErrorMessage, showSuccess } from "@/lib/feedback"
import {
  balanceChanged,
  payoutChanged,
  requestsChanged,
  virtualAccountChanged,
} from "./cache"
import type { Money } from "@/lib/money"

export function onWalletBalance({ balance }: { balance: Money }): void {
  balanceChanged(balance)
}

export function onMoneyRequest(): void {
  requestsChanged()
}

export function onVirtualAccount(): void {
  virtualAccountChanged()
}

export function onWithdrawal(withdrawal: { status: string }): void {
  payoutChanged()
  if (withdrawal.status === "success") {
    showSuccess("Your send reached the bank.")
  } else if (
    withdrawal.status === "failed" ||
    withdrawal.status === "reversed"
  ) {
    showErrorMessage("The bank send failed — the money is back in your wallet.")
  }
}
