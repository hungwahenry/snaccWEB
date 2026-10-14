import { api } from "@/lib/api/client"
import type { OwnAccess } from "../types"

export function getOwnAccess() {
  return api.get<OwnAccess>("/admin/access")
}
