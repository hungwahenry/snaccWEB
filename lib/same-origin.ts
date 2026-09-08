import "server-only"
import type { NextRequest } from "next/server"

/// A browser sends Origin on every state-changing request. Anything that arrives from another
/// site, or with no Origin at all, is not this app asking.
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return false

  try {
    return new URL(origin).host === request.headers.get("host")
  } catch {
    return false
  }
}

export function forbidden(): Response {
  return Response.json(
    { status: "error", message: "Forbidden", code: "forbidden" },
    { status: 403 }
  )
}
