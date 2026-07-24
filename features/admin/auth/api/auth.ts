import { api } from "@/lib/api/client"
import { ApiError } from "@/lib/api/errors"
import type { AuthUser } from "../types"

export function sendOtp(email: string) {
  return api.post<unknown>("/auth/send-otp", { email })
}

export function getMe() {
  return api.get<AuthUser>("/auth/me")
}

export async function login(input: { email: string; code: string }): Promise<{ user: AuthUser }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "same-origin",
  })
  const json = (await res.json().catch(() => null)) as {
    data?: { user: AuthUser }
    message?: string
    code?: string
  } | null
  if (!res.ok || !json?.data) {
    throw new ApiError(res.status, json?.message ?? "Login failed", json?.code ?? null)
  }
  return json.data
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
}
