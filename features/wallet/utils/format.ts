import { currencySymbol, formatMoney, type Money } from "@/lib/money"
import type { VirtualAccount } from "../types"

export function groupAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3")
}

/** Bank, number and name on their own lines, the way people paste account details. */
export function accountShareText(account: VirtualAccount): string {
  return [account.bank_name, account.account_number, account.account_name]
    .filter(Boolean)
    .join("\n")
}

export function balanceText(balance: Money, hidden: boolean): string {
  return hidden
    ? `${currencySymbol(balance.currency)}••••`
    : formatMoney(balance)
}
