import { clearSessionToken, getSessionToken, SNACC_API_URL } from "@/lib/session"

export async function POST() {
  const token = await getSessionToken()
  if (token) {
    await fetch(`${SNACC_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => undefined)
  }
  await clearSessionToken()
  return Response.json({ status: "success", message: "OK", data: null })
}
