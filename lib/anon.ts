import "server-only"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { SNACC_API_URL } from "./session"

const GUEST_COOKIE = "snacc_guest"

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || null
}

export async function forwardAnon(
  request: NextRequest,
  method: "GET" | "POST",
  apiPath: string,
  body?: string,
): Promise<Response> {
  const store = await cookies()
  const token = store.get(GUEST_COOKIE)?.value
  const ip = clientIp(request)

  const headers: Record<string, string> = { Accept: "application/json" }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (token) headers["x-guest-token"] = token
  if (ip) headers["x-guest-ip"] = ip

  const upstream = await fetch(`${SNACC_API_URL}/api/v1${apiPath}`, {
    method,
    headers,
    body,
    cache: "no-store",
  })
  const json = (await upstream.json().catch(() => null)) as {
    data?: { guest_token?: string }
  } | null

  const guestToken = json?.data?.guest_token
  if (upstream.ok && guestToken) {
    store.set(GUEST_COOKIE, guestToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    })
    delete json!.data!.guest_token
  }

  return Response.json(json, { status: upstream.status })
}
