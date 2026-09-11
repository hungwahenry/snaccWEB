import "server-only"
import { redirect } from "next/navigation"
import { HOME_PATH } from "@/features/feed/routes"
import { loginPath } from "@/features/auth/routes"
import { hasAdminAccess, type AdminPermissions } from "./permissions"
import { getUserToken, SNACC_API_URL, WEB_CLIENT_INFO } from "./session"

export async function hasSession(): Promise<boolean> {
  return (await getUserToken()) !== undefined
}

export async function requireSession(next?: string): Promise<void> {
  if (await hasSession()) return
  redirect(loginPath(next))
}

/// The panel needs a session and a role. Permissions come from the API, which is also the only
/// thing enforcing them, so this is about landing somewhere sensible rather than about access.
export async function requireAdminSession(): Promise<void> {
  const token = await getUserToken()
  if (!token) redirect(loginPath("/admin"))

  const res = await fetch(`${SNACC_API_URL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Client-Info": WEB_CLIENT_INFO,
      Accept: "application/json",
    },
    cache: "no-store",
  }).catch(() => null)

  if (!res?.ok) redirect(loginPath("/admin"))

  const body = (await res.json().catch(() => null)) as {
    data?: { permissions?: AdminPermissions }
  } | null

  if (!hasAdminAccess(body?.data?.permissions)) redirect(HOME_PATH)
}
