import { serverGet } from "@/lib/api/server"

export interface PublicSnaccAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { name: string; acronym: string; slug: string } | null
}

export interface PublicSnacc {
  id: string
  body: string | null
  created_at: string
  anonymous: boolean
  author: PublicSnaccAuthor
  images: { url: string; width: number; height: number }[]
  gif: { url: string; width: number; height: number } | null
  reactions: { emoji: string; count: number }[]
  reactions_count: number
  comments_count: number
  resnaccs_count: number
}

export function getPublicSnacc(id: string) {
  return serverGet<PublicSnacc>(`/snaccs/${encodeURIComponent(id)}`)
}

async function listSnaccs(path: string): Promise<PublicSnacc[]> {
  const page = await serverGet<{ items: PublicSnacc[] }>(path)
  return page?.items ?? []
}

export function getUserSnaccs(username: string, perPage = 5) {
  return listSnaccs(`/users/${encodeURIComponent(username)}/snaccs?perPage=${perPage}`)
}

export function getCampusSnaccs(slug: string, perPage = 5) {
  return listSnaccs(`/universities/${encodeURIComponent(slug)}/snaccs?perPage=${perPage}`)
}
