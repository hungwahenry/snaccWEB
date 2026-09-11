import type { AdminReservedUsername, HoldUsernameInput } from "../types"
import { api } from "@/lib/api/client"

export function listReservedUsernames() {
  return api.get<AdminReservedUsername[]>("/admin/reserved-usernames")
}

export function holdUsername(input: HoldUsernameInput) {
  return api.post<AdminReservedUsername>("/admin/reserved-usernames", input)
}

export function releaseUsername(name: string) {
  return api.del<null>(`/admin/reserved-usernames/${name}`)
}
