import "server-only"
import { cookies } from "next/headers"

const ADMIN_COOKIE = "snacc_admin_token"
const USER_COOKIE = "snacc_session"
const INSTALL_COOKIE = "snacc_install_id"

const MONTH_S = 60 * 60 * 24 * 30
const YEAR_S = 60 * 60 * 24 * 365

export const SNACC_API_URL =
  process.env.SNACC_API_URL ?? "http://localhost:3000"

const secure = process.env.NODE_ENV === "production"

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge,
  }
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_COOKIE, token, cookieOptions(MONTH_S))
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

export async function getUserToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(USER_COOKIE)?.value
}

export async function setUserToken(token: string): Promise<void> {
  const store = await cookies()
  store.set(USER_COOKIE, token, cookieOptions(YEAR_S))
}

export async function clearUserToken(): Promise<void> {
  const store = await cookies()
  store.delete(USER_COOKIE)
}

/// The token any authenticated request rides on: the user session first, the admin one otherwise.
export async function getBearerToken(): Promise<string | undefined> {
  return (await getUserToken()) ?? (await getSessionToken())
}

export async function getInstallId(): Promise<string> {
  const store = await cookies()
  const existing = store.get(INSTALL_COOKIE)?.value
  if (existing) return existing

  const id = crypto.randomUUID()
  store.set(INSTALL_COOKIE, id, cookieOptions(YEAR_S))
  return id
}

export async function readInstallId(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(INSTALL_COOKIE)?.value
}

// The API recognises "web" as a client that is not a phone build: it skips the mobile
// minimum-version gate and sits inside every version-windowed flag.
export const WEB_CLIENT_INFO = "web"
