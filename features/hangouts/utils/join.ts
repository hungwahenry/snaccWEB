import type { JoinState, SnaccHangout } from "../types"
import { stateAt } from "./hangouts"

export type JoinButton =
  | { kind: "hosting" }
  | { kind: "going" }
  | { kind: "requested" }
  | { kind: "open"; label: string }
  | { kind: "shut"; label: string }

export interface JoinViewer {
  host: boolean
  campusId: string | null
}

export function nextJoinState(
  hangout: Pick<SnaccHangout, "join_state" | "private">
): JoinState {
  if (hangout.join_state !== "none") return "none"
  return hangout.private ? "requested" : "going"
}

export function withJoinState(
  hangout: SnaccHangout,
  next: JoinState
): SnaccHangout {
  const change =
    (next === "going" ? 1 : 0) - (hangout.join_state === "going" ? 1 : 0)
  const going = Math.max(0, hangout.going_count + change)

  return {
    ...hangout,
    join_state: next,
    going_count: going,
    full: going >= hangout.capacity,
  }
}

export function joinButton(
  hangout: SnaccHangout,
  viewer: JoinViewer,
  now: number
): JoinButton {
  if (viewer.host) return { kind: "hosting" }
  if (hangout.join_state === "going") return { kind: "going" }
  if (hangout.join_state === "requested") return { kind: "requested" }

  const state = stateAt(hangout, now)
  if (state === "cancelled") return { kind: "shut", label: "Called off" }
  if (state === "over") return { kind: "shut", label: "Over" }
  if (now >= Date.parse(hangout.joinable_until)) {
    return { kind: "shut", label: "Started" }
  }
  if (viewer.campusId !== hangout.university_id) {
    return { kind: "shut", label: "Another campus" }
  }
  if (hangout.full && !hangout.private) return { kind: "shut", label: "Full" }

  return { kind: "open", label: hangout.private ? "Ask to join" : "Join" }
}
