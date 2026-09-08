import { api } from "@/lib/api/client"
import type { SnaccAuthor } from "@/features/snaccs/types"

export async function blockUser(userId: string): Promise<void> {
  await api.post("/blocks", { userId })
}

export async function unblockUser(userId: string): Promise<void> {
  await api.del(`/blocks/${userId}`)
}

export function getBlockedAccounts(): Promise<SnaccAuthor[]> {
  return api.get<SnaccAuthor[]>("/blocks")
}
