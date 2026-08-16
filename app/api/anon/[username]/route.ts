import type { NextRequest } from "next/server"
import { forwardAnon } from "@/lib/anon"

export async function POST(request: NextRequest, ctx: { params: Promise<{ username: string }> }) {
  const { username } = await ctx.params
  const body = await request.text()
  return forwardAnon(request, "POST", `/public/anon/${encodeURIComponent(username)}`, body)
}
