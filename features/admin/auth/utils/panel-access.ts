import { can, hasAdminAccess, type AdminPermissions } from "@/lib/permissions"
import { ADMIN_PATH } from "@/features/admin/shell/routes"
import {
  firstAllowedHref,
  permissionForPath,
} from "@/features/admin/shell/utils/nav"

export const OUTSIDE_PANEL_PATH = "/home"

export type PanelAccess =
  | { state: "loading" }
  | { state: "redirect"; to: string }
  | { state: "denied"; permission: string }
  | { state: "allowed" }

/**
 * What the panel shows for a path. The server layout already refused anyone without a role, so
 * this catches a role revoked mid-session, sends someone who cannot read the dashboard to the
 * first page they can, and names the permission a page needs when they lack it.
 */
export function panelAccess({
  pathname,
  permissions,
  failed,
}: {
  pathname: string
  permissions: AdminPermissions | undefined
  failed: boolean
}): PanelAccess {
  if (failed) return { state: "redirect", to: OUTSIDE_PANEL_PATH }
  if (!permissions) return { state: "loading" }
  if (!hasAdminAccess(permissions)) {
    return { state: "redirect", to: OUTSIDE_PANEL_PATH }
  }

  if (pathname === ADMIN_PATH && !can(permissions, "dashboard.read")) {
    return {
      state: "redirect",
      to: firstAllowedHref(permissions) ?? OUTSIDE_PANEL_PATH,
    }
  }

  const permission = permissionForPath(pathname)
  if (permission && !can(permissions, permission)) {
    return { state: "denied", permission }
  }

  return { state: "allowed" }
}
