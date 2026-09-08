import type { NextRequest } from "next/server"
import { forbidden, isCrossSite } from "@/lib/same-origin"
import { getUserToken } from "@/lib/session"

// The realtime socket connects straight to the API, so the browser needs the bearer token once.
export async function GET(request: NextRequest) {
  if (isCrossSite(request)) return forbidden()

  const token = await getUserToken()
  if (!token) {
    return Response.json(
      { status: "error", message: "Not signed in", code: "unauthenticated" },
      { status: 401 }
    )
  }
  return Response.json(
    { status: "success", message: "OK", data: { token } },
    { headers: { "Cache-Control": "no-store" } }
  )
}
