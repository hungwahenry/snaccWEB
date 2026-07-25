import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminConversationDetail,
  AdminConversationRow,
  AdminThreadMessage,
  ListConversationsParams,
} from "./types"

export function listConversations(params: ListConversationsParams) {
  return api.get<Paginated<AdminConversationRow>>(
    "/admin/messages/conversations",
    params as QueryParams,
  )
}

export function getConversation(id: string) {
  return api.get<AdminConversationDetail>(`/admin/messages/conversations/${id}`)
}

export function deleteMessage(id: string, reason?: string) {
  return api.del<AdminThreadMessage>(`/admin/messages/${id}`, reason ? { reason } : undefined)
}

export function restoreMessage(id: string) {
  return api.post<AdminThreadMessage>(`/admin/messages/${id}/restore`)
}
