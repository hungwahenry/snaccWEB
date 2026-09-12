import { userTag } from "@/lib/api/cache-tags"
import { serverGet } from "@/lib/api/server"
import type { PublicProfile } from "../types"

export function getPublicProfile(username: string) {
  return serverGet<PublicProfile>(`/users/${encodeURIComponent(username)}`, [
    userTag(username),
  ])
}
