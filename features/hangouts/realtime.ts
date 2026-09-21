import {
  dropHangouts,
  patchHangout,
  placeChanged,
  refreshHangoutLists,
} from "./cache"
import type { JoinState } from "./types"

export function onSnaccHangout(payload: {
  snacc_id: string
  going_count: number
  capacity: number
  full: boolean
  cancelled: boolean
}): void {
  patchHangout(payload.snacc_id, (hangout) => ({
    ...hangout,
    going_count: payload.going_count,
    capacity: payload.capacity,
    full: payload.full,
    state: payload.cancelled ? "cancelled" : hangout.state,
  }))
  if (payload.cancelled) refreshHangoutLists([payload.snacc_id])
}

export function onHangoutState(payload: {
  snacc_id: string
  state: JoinState
}): void {
  placeChanged(payload.snacc_id, payload.state)
}

export function onHangoutEdited(payload: { snacc_id: string }): void {
  refreshHangoutLists([payload.snacc_id])
}

export function onHangoutsDeleted(payload: { snacc_ids: string[] }): void {
  dropHangouts(payload.snacc_ids)
}
