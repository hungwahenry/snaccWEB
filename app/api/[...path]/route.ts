import type { NextRequest } from "next/server"
import {
  getBearerToken,
  readInstallId,
  SNACC_API_URL,
  WEB_CLIENT_INFO,
} from "@/lib/session"

const FORWARDED = ["content-type", "accept-language"]

async function proxy(
  request: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const { path } = await params
  const token = await getBearerToken()
  const installId = await readInstallId()
  const search = new URL(request.url).search
  const target = `${SNACC_API_URL}/api/${path.join("/")}${search}`

  const headers = new Headers({
    Accept: "application/json",
    "X-Client-Info": WEB_CLIENT_INFO,
  })
  for (const name of FORWARDED) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (installId) headers.set("X-Install-Id", installId)

  const method = request.method
  const hasBody = method !== "GET" && method !== "HEAD"

  const res = await fetch(target, {
    method,
    headers,
    body: hasBody ? request.body : undefined,
    // @ts-expect-error -- streaming a request body needs half duplex in Node's fetch
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
  })

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  })
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
