import { earningsBalanceChanged } from "./cache"

export function onEarningsWallet({ balance }: { balance: number }): void {
  earningsBalanceChanged(balance)
}
