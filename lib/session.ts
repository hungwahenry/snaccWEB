import "server-only"
import { cookies } from "next/headers"

const COOKIE = "snacc_admin_token"

/** The Snacc API origin, called server-side only (BFF). Browser never talks to it directly. */
export const SNACC_API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(COOKIE)?.value
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE)
}
