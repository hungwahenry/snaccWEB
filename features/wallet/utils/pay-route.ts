import type { PayPrefill } from "../types"

type SearchValue = string | string[] | undefined

export type PaySearchParams = Partial<
  Record<"mode" | "to" | "recipient" | "conversation" | "amount", SearchValue>
>

function first(value: SearchValue): string | undefined {
  const one = Array.isArray(value) ? value[0] : value
  return one?.trim() || undefined
}

/** Reads a pay link's query, so an odd or doubled parameter can't break the screen. */
export function payPrefillFrom(params: PaySearchParams): PayPrefill {
  const mode = first(params.mode)
  const amount = first(params.amount)

  return {
    mode: mode === "request" || mode === "topup" ? mode : "send",
    to: first(params.to)?.replace(/^@/, ""),
    recipientId: first(params.recipient),
    conversationId: first(params.conversation),
    amount: amount && /^\d+(\.\d{1,2})?$/.test(amount) ? amount : undefined,
  }
}

/** A new pay link means a fresh flow, not the old one carried over. */
export function prefillKey(prefill: PayPrefill): string {
  return [
    prefill.mode,
    prefill.to,
    prefill.recipientId,
    prefill.conversationId,
    prefill.amount,
  ]
    .map((part) => part ?? "")
    .join(":")
}
