import { serverGet } from "@/lib/api/server"
import type { Author } from "@/features/users/types"

export const getInviter = (code: string) =>
  serverGet<Author>(`/referrals/code/${encodeURIComponent(code)}`)
