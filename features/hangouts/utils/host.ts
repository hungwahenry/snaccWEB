import type { SnaccHangout } from "../types"

function withGoing(hangout: SnaccHangout, going: number): SnaccHangout {
  return { ...hangout, going_count: going, full: going >= hangout.capacity }
}

export function afterAnswer(
  hangout: SnaccHangout,
  accepted: boolean
): SnaccHangout {
  return withGoing(
    {
      ...hangout,
      requests_count: Math.max(0, (hangout.requests_count ?? 0) - 1),
    },
    hangout.going_count + (accepted ? 1 : 0)
  )
}

export function afterRemoval(hangout: SnaccHangout): SnaccHangout {
  return withGoing(hangout, Math.max(1, hangout.going_count - 1))
}

export function othersIn(hangout: SnaccHangout): number {
  return hangout.going_count - 1 + (hangout.requests_count ?? 0)
}
