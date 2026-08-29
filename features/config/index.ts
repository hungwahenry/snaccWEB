import { api } from "@/lib/api/client"

/** The same public payload the app reads, so a value set once is honoured by both. */
export type PublicConfig = Record<string, unknown>

export function getPublicConfig() {
  return api.get<{ values: PublicConfig; flags: Record<string, boolean> }>(
    "/config"
  )
}
