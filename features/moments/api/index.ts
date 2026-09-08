import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type { Moment, MomentViewer, TrayEntry } from "../types"

export const getTray = () => api.get<TrayEntry[]>("/moments/tray")

export const getMomentsByAuthor = (authorId: string) =>
  api.get<Moment[]>(`/moments/user/${authorId}`)

export async function getMomentViewers(
  momentId: string
): Promise<MomentViewer[]> {
  const page = await api.get<Paginated<MomentViewer>>(
    `/moments/${momentId}/viewers`
  )
  return page.items
}

export const markMomentSeen = (momentId: string) =>
  api.post<void>(`/moments/${momentId}/view`)

export const reactToMoment = (momentId: string, emoji: string) =>
  api.put<void>(`/moments/${momentId}/reactions`, { emoji })

export const unreactToMoment = (momentId: string) =>
  api.del<void>(`/moments/${momentId}/reactions`)

export interface MomentReplyResult {
  conversationId: string
  messageId: string
}

export const replyToMoment = (momentId: string, body: string) =>
  api.post<MomentReplyResult>(`/moments/${momentId}/reply`, { body })

export interface CreateMomentInput {
  id: string
  body?: string
  background?: string
  image?: PickedImage
}

export function createMoment(input: CreateMomentInput): Promise<Moment> {
  if (!input.image) {
    return api.post<Moment>("/moments", {
      id: input.id,
      body: input.body,
      background: input.background,
    })
  }

  const form = new FormData()
  form.append("id", input.id)
  if (input.body) form.append("body", input.body)
  appendImage(form, "image", input.image, "moment")
  return api.upload<Moment>("/moments", form)
}

export const deleteMoment = (momentId: string) =>
  api.del<void>(`/moments/${momentId}`)
