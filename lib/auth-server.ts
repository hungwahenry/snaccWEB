import "server-only"
import { redirect } from "next/navigation"
import { getSessionToken, getUserToken } from "./session"

export async function hasSession(): Promise<boolean> {
  return (await getUserToken()) !== undefined
}

export async function requireSession(next?: string): Promise<void> {
  if (await hasSession()) return
  redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login")
}

export async function hasAdminSession(): Promise<boolean> {
  return (await getSessionToken()) !== undefined
}

/// The panel's own gate. It only proves a session exists; which sections that session may open is
/// the API's call, checked on every request it serves.
export async function requireAdminSession(): Promise<void> {
  if (await hasAdminSession()) return
  redirect("/admin/login")
}
