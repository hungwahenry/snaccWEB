import { api } from "@/lib/api/client"
import { ApiError } from "@/lib/api/errors"
import type { User } from "@/features/users/types"
import type { SignInInput, SignInResult } from "../types"

export async function sendOtp(email: string): Promise<void> {
  await api.post<null>("/auth/send-otp", { email })
}

export function getMe(): Promise<User> {
  return api.get<User>("/auth/me")
}

// Sign in and out go through the site, not the API: the token lives in an httpOnly cookie
// the browser never sees.
export async function signIn(input: SignInInput): Promise<SignInResult> {
  let res: Response
  try {
    res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "same-origin",
    })
  } catch {
    throw ApiError.network()
  }

  const json = (await res.json().catch(() => null)) as {
    data?: SignInResult
    message?: string
    code?: string
    errors?: Record<string, string[]>
  } | null

  if (!res.ok || !json?.data) {
    throw new ApiError(
      res.status,
      json?.message ?? "Sign in failed",
      json?.code ?? null,
      json?.errors
    )
  }

  return json.data
}

export async function signOut(): Promise<void> {
  await fetch("/api/session", {
    method: "DELETE",
    credentials: "same-origin",
  }).catch(() => undefined)
}
