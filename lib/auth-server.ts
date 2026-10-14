import "server-only"
import { redirect } from "next/navigation"
import { HOME_PATH } from "@/features/feed/routes"
import { expiredSessionPath, loginPath } from "@/features/auth/routes"
import { holdPath } from "@/features/navigation/utils/gate"
import { hasAdminAccess, type AdminPermissions } from "./permissions"
import { getUserToken, SNACC_API_URL, WEB_CLIENT_INFO } from "./session"

export async function hasSession(): Promise<boolean> {
  return (await getUserToken()) !== undefined
}

export async function requireSession(next?: string): Promise<void> {
  if (await hasSession()) return
  redirect(loginPath(next))
}

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
  if (!res) throw new Error("Couldn't reach Snacc. Try again in a moment.")
  if (res.status === 401) redirect(expiredSessionPath("/admin"))

  const body = (await res.json().catch(() => null)) as {
    code?: string
    data?: { permissions?: AdminPermissions }
  } | null
  if (!res.ok) {
    const held = holdPath(body?.code)
    if (held) redirect(held)
    throw new Error("Couldn't load your account. Try again in a moment.")
  }

  if (!hasAdminAccess(body?.data?.permissions)) redirect(HOME_PATH)
}
