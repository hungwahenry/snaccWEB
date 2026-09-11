import { serverGet } from "@/lib/api/server"
import type { PublicProfile } from "../types"

export function getPublicProfile(username: string) {
  return serverGet<PublicProfile>(`/users/${encodeURIComponent(username)}`)
}
