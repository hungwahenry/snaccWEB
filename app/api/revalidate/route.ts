import { revalidateTag } from "next/cache"
import { SNACCS_TAG, userTag } from "@/lib/api/cache-tags"

/**
 * The backend calls this when someone's profile changes in a way the public pages must show at
 * once, such as going private. Expired rather than marked stale, so the next visitor can't be
 * served the old page.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return new Response(null, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as {
    username?: unknown
  } | null
  if (typeof body?.username !== "string" || !body.username) {
    return new Response(null, { status: 400 })
  }

  revalidateTag(userTag(body.username), { expire: 0 })
  revalidateTag(SNACCS_TAG, { expire: 0 })
  return new Response(null, { status: 204 })
}
