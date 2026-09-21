import type { HangoutPayload, SnaccHangout } from "../types"

export function optimisticHangout(
  payload: HangoutPayload,
  campusId: string
): SnaccHangout {
  return {
    title: payload.title,
    emoji: payload.emoji,
    place: payload.place,
    starts_at: payload.startsAt,
    joinable_until: payload.startsAt,
    wraps_at: payload.startsAt,
    capacity: payload.capacity,
    going_count: 1,
    full: payload.capacity <= 1,
    private: payload.private,
    state: "upcoming",
    join_state: "going",
    requests_count: 0,
    university_id: campusId,
  }
}
