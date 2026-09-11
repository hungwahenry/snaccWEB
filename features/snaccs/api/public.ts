import { serverGet } from "@/lib/api/server"
import type { Paginated } from "@/lib/api/types"
import type { Snacc, SnaccWithParent } from "../types"

const PREVIEW_COUNT = 5

export function getPublicSnacc(id: string): Promise<Snacc | null> {
  return serverGet<Snacc>(`/snaccs/${encodeURIComponent(id)}`)
}

async function firstPage<T>(path: string): Promise<T[]> {
  const page = await serverGet<Paginated<T>>(`${path}?perPage=${PREVIEW_COUNT}`)
  return page?.items ?? []
}

export function getUserSnaccs(username: string): Promise<SnaccWithParent[]> {
  return firstPage(`/users/${encodeURIComponent(username)}/snaccs`)
}

export function getCampusSnaccs(slug: string): Promise<Snacc[]> {
  return firstPage(`/universities/${encodeURIComponent(slug)}/snaccs`)
}
