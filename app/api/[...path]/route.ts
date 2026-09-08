import type { NextRequest } from "next/server"
import { forbidden, isSameOrigin } from "@/lib/same-origin"
import {
  getBearerToken,
  readInstallId,
  SNACC_API_URL,
  WEB_CLIENT_INFO,
} from "@/lib/session"

const FORWARDED = ["content-type", "accept-language"]
const SAFE = new Set(["GET", "HEAD"])

function badPath(path: string[]): boolean {
  return path.some(
    (segment) => segment === "" || segment === "." || segment === ".."
  )
}

async function proxy(
  request: NextRequest,
  params: Promise<{ path: string[] }>
) {
  if (!SAFE.has(request.method) && !isSameOrigin(request)) return forbidden()

  const { path } = await params
  if (badPath(path)) return forbidden()

  const token = await getBearerToken()
  const installId = await readInstallId()
  const search = new URL(request.url).search
  const target = `${SNACC_API_URL}/api/${path.join("/")}${search}`

  const upstream = new Headers({
    Accept: "application/json",
    "X-Client-Info": WEB_CLIENT_INFO,
  })
  for (const name of FORWARDED) {
    const value = request.headers.get(name)
    if (value) upstream.set(name, value)
  }
  if (token) upstream.set("Authorization", `Bearer ${token}`)
  if (installId) upstream.set("X-Install-Id", installId)

  const method = request.method
  const hasBody = method !== "GET" && method !== "HEAD"

  const res = await fetch(target, {
    method,
    headers: upstream,
    body: hasBody ? request.body : undefined,
    // @ts-expect-error -- streaming a request body needs half duplex in Node's fetch
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
  })

  const headers = new Headers({
    "Content-Type": res.headers.get("content-type") ?? "application/json",
    "Cache-Control": "no-store",
  })
  const retryAfter = res.headers.get("retry-after")
  if (retryAfter) headers.set("Retry-After", retryAfter)

  return new Response(res.body, { status: res.status, headers })
}

type Ctx = { params: Promise<{ path: string[] }> }

export function GET(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx.params)
}
export function POST(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx.params)
}
export function PATCH(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx.params)
}
export function PUT(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx.params)
}
export function DELETE(request: NextRequest, ctx: Ctx) {
  return proxy(request, ctx.params)
}
