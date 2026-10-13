import type { UseQueryResult } from "@tanstack/react-query"
import { WAITING_PATH } from "@/features/availability/routes"
import { BIRTH_DATE_PATH } from "@/features/birthdays/routes"
import { AGREE_PATH } from "@/features/legal/routes"
import { COMPLETE_PROFILE_PATH } from "@/features/onboarding/routes"
import { SUSPENDED_PATH } from "@/features/suspensions/routes"
import type { User } from "@/features/users/types"
import {
  isSuspended,
  isUnauthenticated,
  isWaiting,
  mustAgree,
  needsBirthDate,
} from "@/lib/api/errors"

const HELD: [(error: unknown) => boolean, string][] = [
  [isSuspended, SUSPENDED_PATH],
  [isWaiting, WAITING_PATH],
  [mustAgree, AGREE_PATH],
  [needsBirthDate, BIRTH_DATE_PATH],
]

export function gatePath(
  me: Pick<UseQueryResult<User>, "isError" | "error" | "data">,
  pathname: string
): string | null {
  if (me.isError) {
    if (isUnauthenticated(me.error)) {
      return `/login?next=${encodeURIComponent(pathname)}`
    }
    const held = HELD.find(([holds]) => holds(me.error))
    if (held) return held[1]
  }
  return me.data && !me.data.profile?.completed_at
    ? COMPLETE_PROFILE_PATH
    : null
}
