import { api } from "@/lib/api/client"

export type PublicConfig = Record<string, unknown>

export function getPublicConfig() {
  return api.get<{ values: PublicConfig; flags: Record<string, boolean> }>(
    "/config"
  )
}
