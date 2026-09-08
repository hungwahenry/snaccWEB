export const WALLET_PATH = "/wallet"
export const PAY_LINK_PATH = "/wallet/pay-link"
export const RECEIVE_PATH = "/wallet/receive"
export const WALLET_PIN_PATH = "/wallet/pin"
export const WALLET_LIMITS_PATH = "/wallet/limits"
export const WALLET_MUTED_PATH = "/wallet/muted"
export const MONEY_SETTINGS_PATH = "/wallet/settings"
export const EARNINGS_PATH = "/earnings"

export type PayMode = "send" | "request" | "topup"

export function payPath(
  params: {
    mode?: PayMode
    to?: string
    recipient?: string
    conversation?: string
    amount?: string
  } = {}
): string {
  const search = new URLSearchParams()
  if (params.mode) search.set("mode", params.mode)
  if (params.to) search.set("to", params.to)
  if (params.recipient) search.set("recipient", params.recipient)
  if (params.conversation) search.set("conversation", params.conversation)
  if (params.amount) search.set("amount", params.amount)
  const qs = search.toString()
  return qs ? `/pay?${qs}` : "/pay"
}
