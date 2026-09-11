import type { VirtualAccount } from "../types"

export type ReceiveView =
  "loading" | "failed" | "active" | "pending" | "activate"

/** What the account number page shows. A failed opening goes back to the form to try again. */
export function receiveView(state: {
  loading: boolean
  failed: boolean
  account: VirtualAccount | null
}): ReceiveView {
  if (state.loading) return "loading"
  if (state.failed && !state.account) return "failed"
  if (state.account?.status === "active" && state.account.account_number)
    return "active"
  if (state.account?.status === "pending") return "pending"
  return "activate"
}

export function activeAccountNumber(
  account: VirtualAccount | null | undefined
): string | null {
  return account?.status === "active" ? account.account_number : null
}
