import type { PublicConfig } from "../types"
import { api } from "@/lib/api/client"

export function getPublicConfig() {
  return api.get<PublicConfig>("/config")
}
