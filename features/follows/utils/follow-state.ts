import type { FollowState } from "../types"

/** What a tap on the button will most likely end in, shown before the server says. */
export function nextFollowState(
  current: FollowState,
  isPrivate: boolean
): FollowState {
  if (current !== "none") return "none"
  return isPrivate ? "requested" : "following"
}

export function followButtonLabel(
  state: FollowState,
  followsYou: boolean
): string {
  if (state === "following") return "Following"
  if (state === "requested") return "Requested"
  return followsYou ? "Follow back" : "Follow"
}
