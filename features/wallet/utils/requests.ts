import type { MoneyRequest } from "../types"

export type MoneyTone = "good" | "bad" | "quiet" | "open"

export type RequestBox = "incoming" | "outgoing"

export interface RequestState {
  open: boolean
  label: string
  tone: MoneyTone
}

export function isOpenRequest(request: MoneyRequest): boolean {
  return (
    request.status === "pending" && new Date(request.expires_at) > new Date()
  )
}

const RESOLVED: Record<string, { label: string; tone: MoneyTone }> = {
  paid: { label: "Paid", tone: "good" },
  declined: { label: "Declined", tone: "bad" },
  cancelled: { label: "Cancelled", tone: "quiet" },
  expired: { label: "Expired", tone: "quiet" },
}

export function requestState(
  request: MoneyRequest,
  box: RequestBox
): RequestState {
  if (isOpenRequest(request)) {
    return {
      open: true,
      label: box === "incoming" ? "Waiting on you" : "Waiting on them",
      tone: "open",
    }
  }

  const resolved =
    RESOLVED[request.status === "pending" ? "expired" : request.status]
  return {
    open: false,
    label: resolved?.label ?? request.status,
    tone: resolved?.tone ?? "quiet",
  }
}
