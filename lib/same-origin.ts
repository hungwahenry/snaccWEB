import "server-only"
import type { NextRequest } from "next/server"

function originMatches(request: NextRequest): boolean | null {
  const origin = request.headers.get("origin")
  if (!origin) return null

  try {
    return new URL(origin).host === request.headers.get("host")
  } catch {
    return false
  }
}

/// For writes. Browsers send Origin on every request that is not a same-origin GET or HEAD, so a
/// missing Origin here is not this app asking.
export function isSameOrigin(request: NextRequest): boolean {
  const site = request.headers.get("sec-fetch-site")
  if (site) return site === "same-origin" || site === "none"

  return originMatches(request) === true
}

/// For reads. A same-origin GET carries no Origin at all, so silence has to pass; only a header
/// that positively says another site is a refusal.
export function isCrossSite(request: NextRequest): boolean {
  const site = request.headers.get("sec-fetch-site")
  if (site) return site !== "same-origin" && site !== "none"

  return originMatches(request) === false
}

export function forbidden(): Response {
  return Response.json(
    { status: "error", message: "Forbidden", code: "forbidden" },
    { status: 403 }
  )
}
