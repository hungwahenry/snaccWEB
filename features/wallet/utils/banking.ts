import type { Banking, DepositMethod, PayoutMethod } from "../types"

export function offers(
  banking: Banking | null,
  method: DepositMethod | PayoutMethod
): boolean {
  if (!banking) return false
  const methods: readonly string[] = [
    ...banking.deposit_methods,
    ...banking.payout_methods,
  ]
  return methods.includes(method)
}

export function isAccountNumber(value: string, length: number): boolean {
  const number = value.trim()
  return number.length === length && /^\d+$/.test(number)
}

export function isBankAccount(value: string, banking: Banking | null): boolean {
  return (
    banking !== null &&
    offers(banking, "bank_account") &&
    isAccountNumber(value, banking.account_number_length)
  )
}
