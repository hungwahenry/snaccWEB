import { serverGet } from "@/lib/api/server"

export interface PublicProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  bio: string | null
  major: string | null
  graduation_year: number | null
  university: { name: string; acronym: string; slug: string } | null
  snaccs_count: number
  followers_count: number
  following_count: number
  total_views_received: number
}

export function getPublicProfile(username: string) {
  return serverGet<PublicProfile>(`/users/${encodeURIComponent(username)}`)
}
