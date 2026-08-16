import type { NextRequest } from "next/server"
import { forwardAnon } from "@/lib/anon"

export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return forwardAnon("GET", `/public/anon/thread/${encodeURIComponent(id)}`)
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const body = await request.text()
  return forwardAnon("POST", `/public/anon/thread/${encodeURIComponent(id)}`, body)
}
