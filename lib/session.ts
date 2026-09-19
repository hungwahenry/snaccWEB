import "server-only"
import { cookies } from "next/headers"

const USER_COOKIE = "snacc_session"
const INSTALL_COOKIE = "snacc_install_id"
const SIGNED_IN_COOKIE = "snacc_signed_in"

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

export async function getUserToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(USER_COOKIE)?.value
}

export async function setUserToken(token: string): Promise<void> {
  const store = await cookies()
  store.set(USER_COOKIE, token, cookieOptions(YEAR_S))
  store.set(SIGNED_IN_COOKIE, "1", {
    ...cookieOptions(YEAR_S),
    httpOnly: false,
  })
}

export async function clearUserToken(): Promise<void> {
  const store = await cookies()
  store.delete(USER_COOKIE)
  store.delete(SIGNED_IN_COOKIE)
}

export async function getBearerToken(): Promise<string | undefined> {
  return getUserToken()
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

const PROXY_SECRET = process.env.WEB_PROXY_SECRET

function visitorIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || headers.get("x-real-ip")?.trim() || undefined
}

export function visitorHeaders(headers: Headers): Record<string, string> {
  const ip = visitorIp(headers)
  if (!PROXY_SECRET || !ip) return {}

  return { "X-Web-Proxy-Key": PROXY_SECRET, "X-Web-Client-Ip": ip }
}

// The API recognises "web" as a client that is not a phone build: it skips the mobile
// minimum-version gate and sits inside every version-windowed flag.
export const WEB_CLIENT_INFO = "web"
