import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import { loginPath } from "@/features/auth/routes"
import { safeNextPath } from "@/features/auth/utils/next-path"
import { clearUserToken } from "@/lib/session"

export async function GET(request: NextRequest) {
  await clearUserToken()
  redirect(
    loginPath(
      safeNextPath(request.nextUrl.searchParams.get("next") ?? undefined)
    )
  )
}
