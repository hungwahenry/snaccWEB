import "server-only"
import { redirect } from "next/navigation"
import { getUserToken } from "./session"

export async function hasSession(): Promise<boolean> {
  return (await getUserToken()) !== undefined
}

export async function requireSession(next?: string): Promise<void> {
  if (await hasSession()) return
  redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login")
}
