import { api } from "@/lib/api/client"
import type { AdminAccount } from "../types"

export function listAdmins() {
  return api.get<AdminAccount[]>("/admin/roles/admins")
}
