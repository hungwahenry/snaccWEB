import { decodeTime, isValid } from "ulid"
import { handleOf } from "@/features/users/utils/names"
import { DAY_MS } from "@/lib/duration"
import { formatNaira } from "@/lib/format"
import type {
  MoneyPerson,
  MoneyRequest,
  RequestBox,
  StatusLook,
} from "../types"

const RESOLVED: Record<string, StatusLook> = {
  paid: { label: "Paid", tone: "good" },
  declined: { label: "Declined", tone: "bad" },
  cancelled: { label: "Cancelled", tone: "quiet" },
  expired: { label: "Expired", tone: "quiet" },
}

/** A pending request past its expiry is expired, whether or not the nightly sweep has run yet. */
export function isOpenRequest(
  request: MoneyRequest,
  now = Date.now()
): boolean {
  return request.status === "pending" && Date.parse(request.expires_at) > now
}

/** When a request lapses, read off the time in its id: a DM's card carries no expiry of its own. */
export function estimatedRequestExpiry(
  requestId: string,
  expiryDays: number
): number | null {
  if (!isValid(requestId)) return null
  return decodeTime(requestId) + expiryDays * DAY_MS
}

export function openRequests(
  requests: MoneyRequest[],
  now = Date.now()
): MoneyRequest[] {
  return requests.filter((request) => isOpenRequest(request, now))
}

export interface RequestState extends StatusLook {
  open: boolean
}

export function requestState(
  request: MoneyRequest,
  box: RequestBox,
  now = Date.now()
): RequestState {
  if (isOpenRequest(request, now)) {
    return {
      open: true,
      label: box === "incoming" ? "Waiting on you" : "Waiting on them",
      tone: "open",
    }
  }

  const status = request.status === "pending" ? "expired" : request.status
  return {
    open: false,
    ...(RESOLVED[status] ?? { label: request.status, tone: "quiet" }),
  }
}

export function requestCounterparty(
  request: MoneyRequest,
  box: RequestBox
): MoneyPerson {
  return box === "incoming" ? request.requester : request.target
}

export function requestHandle(request: MoneyRequest, box: RequestBox): string {
  return handleOf(requestCounterparty(request, box)) ?? "Someone"
}

export function requestHeadline(
  request: MoneyRequest,
  box: RequestBox
): string {
  const who = requestHandle(request, box)
  return box === "incoming" ? `${who} asked you` : `You asked ${who}`
}

/** The second line of a request: its note, or what happened. */
export function requestLine(request: MoneyRequest, box: RequestBox): string {
  if (request.note) return `“${request.note}”`
  return box === "incoming" ? "Asked you for money" : "You asked"
}

export function declineTitle(request: MoneyRequest): string {
  return `Decline ${handleOf(request.requester) ?? "this request"}?`
}

export function cancelTitle(request: MoneyRequest): string {
  return `Cancel your ${formatNaira(request.amount)} request?`
}

export function mutedMessage(request: MoneyRequest): string {
  return `Declined. ${handleOf(request.requester) ?? "They"} can't ask you again.`
}

export function cannotCoverMessage(amount: number, balance: number): string {
  return `That needs ${formatNaira(amount)} — you have ${formatNaira(balance)}.`
}
