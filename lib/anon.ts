import "server-only"
import { cookies } from "next/headers"
import { SNACC_API_URL } from "./session"

const GUEST_COOKIE = "snacc_guest"

/**
 * Proxies a public-anon request to the API, translating the httpOnly guest cookie to/from the
 * API's `x-guest-token` header. A freshly minted token is captured into the cookie and hidden
 * from the browser, so the guest's identity never touches client JS.
 */
export async function forwardAnon(
  method: "GET" | "POST",
  apiPath: string,
  body?: string,
): Promise<Response> {
  const store = await cookies()
  const token = store.get(GUEST_COOKIE)?.value

  const headers: Record<string, string> = { Accept: "application/json" }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (token) headers["x-guest-token"] = token

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
