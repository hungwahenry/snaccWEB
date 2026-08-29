import type { NextRequest } from "next/server"
import { hasAdminAccess, type AdminPermissions } from "@/lib/permissions"
import { setSessionToken, SNACC_API_URL } from "@/lib/session"

export async function POST(request: NextRequest) {
  const { email, code } = (await request.json()) as {
    email?: string
    code?: string
  }

  const res = await fetch(`${SNACC_API_URL}/api/v1/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
    cache: "no-store",
  })
  const json = (await res.json().catch(() => null)) as {
    data?: {
      token: string
      user: { role: string; permissions?: AdminPermissions }
    }
    message?: string
    code?: string
  } | null

  if (!res.ok || !json?.data) {
    return Response.json(json ?? { message: "Login failed" }, {
      status: res.status || 500,
    })
  }

  if (!hasAdminAccess(json.data.user.permissions)) {
    return Response.json(
      {
        status: "error",
        message: "This account has no admin access.",
        code: "not_admin",
      },
      { status: 403 }
    )
  }

  await setSessionToken(json.data.token)
  return Response.json({
    status: "success",
    message: "OK",
    data: { user: json.data.user },
  })
}
