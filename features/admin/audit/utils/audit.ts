import {
  pagePath,
  snaccPath,
  userPath,
  walletPath,
  withdrawalPath,
} from "@/features/admin/shell/routes"
import type { Option } from "@/features/admin/shell/types"
import { humanize } from "@/features/admin/shell/utils/format"
import { userHandle } from "@/features/admin/shell/utils/user"
import type { AuditListQuery, AuditLog } from "../types"

export const SEARCH_MAX = 100

/** What to fetch for the filters in the URL. Search is capped at what the API accepts. */
export function auditQuery({
  page,
  perPage,
  q,
  action,
}: {
  page: number
  perPage: number
  q: string
  action: string | null
}): AuditListQuery {
  return {
    page,
    perPage,
    q: q.trim().slice(0, SEARCH_MAX) || undefined,
    action: action ?? undefined,
  }
}

/** "user.suspend" reads as "User: suspend"; "ops.run.repair-counters" as "Ops: run repair counters". */
export function actionLabel(action: string): string {
  const [area, ...rest] = action.split(".")
  const what = rest.join(" ").replace(/[_-]+/g, " ").trim()

  return what ? `${humanize(area)}: ${what}` : humanize(area)
}

export function actionOptions(actions: string[]): Option[] {
  return actions.map((action) => ({
    value: action,
    label: actionLabel(action),
  }))
}

/** The admin by their handle, or by email when they never picked one. */
export function adminLabel(log: AuditLog): string {
  return userHandle({ username: log.admin_username, email: log.admin_email })
}

const TARGET_PATHS: Record<string, (id: string) => string> = {
  user: userPath,
  wallet_account: walletPath,
  snacc: snaccPath,
  page: pagePath,
  withdrawal: withdrawalPath,
}

/** Where the changed thing lives in the panel, when it has a page of its own. */
export function targetHref(log: AuditLog): string | null {
  if (log.target_id === null) return null

  return TARGET_PATHS[log.target_type]?.(log.target_id) ?? null
}

export function hasSnapshot(log: AuditLog): boolean {
  return log.before !== null || log.after !== null
}
