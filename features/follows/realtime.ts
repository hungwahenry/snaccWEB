import { setFollowState } from "./cache"
import type { FollowState } from "./types"

export interface FollowStatePayload {
  user_id: string
  username: string | null
  state: FollowState
}

export function onFollowState(payload: FollowStatePayload): void {
  setFollowState(
    { id: payload.user_id, username: payload.username },
    payload.state
  )
}
