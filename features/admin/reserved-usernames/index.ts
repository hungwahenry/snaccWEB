import { api } from "@/lib/api/client"

export interface AdminReservedUsername {
  name: string
  reason: string
  seeded: boolean
  created_at: string
}

export function listReservedUsernames() {
  return api.get<AdminReservedUsername[]>("/admin/reserved-usernames")
}

export function holdUsername(body: { name: string; reason: string }) {
  return api.post<AdminReservedUsername>("/admin/reserved-usernames", body)
}

export function releaseUsername(name: string) {
  return api.del<null>(`/admin/reserved-usernames/${name}`)
}
