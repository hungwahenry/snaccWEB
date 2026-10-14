import type { UseQueryResult } from "@tanstack/react-query"
import { WAITING_PATH } from "@/features/availability/routes"
import { BIRTH_DATE_PATH } from "@/features/birthdays/routes"
import { AGREE_PATH } from "@/features/legal/routes"
import { COMPLETE_PROFILE_PATH } from "@/features/onboarding/routes"
import { SUSPENDED_PATH } from "@/features/suspensions/routes"
import type { User } from "@/features/users/types"
import { isApiError, isUnauthenticated } from "@/lib/api/errors"

export const HOLD_PATHS: Record<string, string> = {
  account_suspended: SUSPENDED_PATH,
  campus_not_open: WAITING_PATH,
  legal_agreement_required: AGREE_PATH,
  birth_date_required: BIRTH_DATE_PATH,
}

export function holdPath(code: string | null | undefined): string | null {
  return (code && HOLD_PATHS[code]) || null
}

export function gatePath(
  me: Pick<UseQueryResult<User>, "isError" | "error" | "data">,
  pathname: string
): string | null {
  if (me.isError) {
    if (isUnauthenticated(me.error)) {
      return `/login?next=${encodeURIComponent(pathname)}`
    }
    const held = isApiError(me.error) ? holdPath(me.error.code) : null
    if (held) return held
  }
  return me.data && !me.data.profile?.completed_at
    ? COMPLETE_PROFILE_PATH
    : null
}
