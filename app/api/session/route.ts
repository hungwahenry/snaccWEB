import type { NextRequest } from "next/server"
import {
  clearUserToken,
  getInstallId,
  getUserToken,
  setUserToken,
  SNACC_API_URL,
  WEB_CLIENT_INFO,
} from "@/lib/session"

export async function POST(request: NextRequest) {
  const { email, code } = (await request.json()) as {
    email?: string
    code?: string
  }
  const installId = await getInstallId()

  const res = await fetch(`${SNACC_API_URL}/api/v1/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Install-Id": installId,
      "X-Client-Info": WEB_CLIENT_INFO,
      "User-Agent": request.headers.get("user-agent") ?? "web",
    },
    body: JSON.stringify({ email, code }),
    cache: "no-store",
  })
  const json = (await res.json().catch(() => null)) as {
    data?: { token: string; user: unknown; is_new_user: boolean }
  } | null

  if (!res.ok || !json?.data) {
    return Response.json(json ?? { message: "Sign in failed" }, {
      status: res.status || 500,
    })
  }

  await setUserToken(json.data.token)
  return Response.json({
    status: "success",
    message: "OK",
    data: { user: json.data.user, is_new_user: json.data.is_new_user },
  })
}

export async function DELETE() {
  const token = await getUserToken()
  if (token) {
    await fetch(`${SNACC_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => undefined)
  }
  await clearUserToken()
  return Response.json({ status: "success", message: "OK", data: null })
}
