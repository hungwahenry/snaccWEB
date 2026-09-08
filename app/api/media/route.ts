import type { NextRequest } from "next/server"
import { forbidden } from "@/lib/same-origin"
import { isProxyableMedia } from "@/lib/media-url"

const YEAR_S = 31_536_000

export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams.get("url")
  if (!url || !isProxyableMedia(url)) return forbidden()

  const upstream = await fetch(url, { cache: "force-cache" })
  if (!upstream.ok) {
    return new Response(null, { status: upstream.status })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": `public, max-age=${YEAR_S}, immutable`,
    },
  })
}
