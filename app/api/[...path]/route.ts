import type { NextRequest } from "next/server"
import { getSessionToken, SNACC_API_URL } from "@/lib/session"

async function proxy(request: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params
  const token = await getSessionToken()
  const search = new URL(request.url).search
  const target = `${SNACC_API_URL}/api/${path.join("/")}${search}`

  const headers: Record<string, string> = { Accept: "application/json" }
  const contentType = request.headers.get("content-type")
  if (contentType) headers["Content-Type"] = contentType
  if (token) headers["Authorization"] = `Bearer ${token}`

  const method = request.method
  const body = method === "GET" || method === "HEAD" ? undefined : await request.text()

  const res = await fetch(target, { method, headers, body, cache: "no-store" })
  const payload = await res.text()

  return new Response(payload, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
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
