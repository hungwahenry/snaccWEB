import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type {
  CommentSort,
  ResnaccSummary,
  Snacc,
  SnaccPoll,
  SnaccReaction,
  SnaccReactor,
  SnaccResnaccer,
} from "../types"

export interface CreateSnaccInput {
  id: string
  body?: string
  images?: PickedImage[]
  giphyId?: string
  stickerId?: string
  parentId?: string
  resnaccOfId?: string
  poll?: { options: string[]; images?: PickedImage[]; durationMinutes: number }
  spoiler?: boolean
}

function pollField(poll: CreateSnaccInput["poll"]): string | undefined {
  return poll
    ? JSON.stringify({
        options: poll.options,
        duration_minutes: poll.durationMinutes,
      })
    : undefined
}

export function createSnacc(input: CreateSnaccInput): Promise<Snacc> {
  const multipart =
    (input.images?.length ?? 0) > 0 || (input.poll?.images?.length ?? 0) > 0

  if (!multipart) {
    return api.post<Snacc>("/snaccs", {
      id: input.id,
      body: input.body,
      giphyId: input.giphyId,
      stickerId: input.stickerId,
      parentId: input.parentId,
      resnaccOfId: input.resnaccOfId,
      spoiler: input.spoiler,
      poll: pollField(input.poll),
    })
  }

  const form = new FormData()
  const fields: [string, string | undefined][] = [
    ["id", input.id],
    ["body", input.body],
    ["parentId", input.parentId],
    ["resnaccOfId", input.resnaccOfId],
    ["giphyId", input.giphyId],
    ["spoiler", input.spoiler ? "true" : undefined],
    ["poll", pollField(input.poll)],
  ]
  fields.forEach(([name, value]) => {
    if (value) form.append(name, value)
  })
  input.poll?.images?.forEach((image, index) =>
    appendImage(form, "pollImages", image, `poll-${index}`)
  )
  input.images?.forEach((image, index) =>
    appendImage(form, "images", image, `snacc-${index}`)
  )

  return api.upload<Snacc>("/snaccs", form)
}

export interface EditSnaccInput {
  id: string
  body?: string
  keepImageIds: string[]
  images: PickedImage[]
  giphyId?: string
  stickerId?: string
  spoiler?: boolean
}

export function editSnacc(input: EditSnaccInput): Promise<Snacc> {
  const form = new FormData()
  if (input.body) form.append("body", input.body)
  if (input.giphyId) form.append("giphyId", input.giphyId)
  if (input.stickerId) form.append("stickerId", input.stickerId)
  if (input.spoiler) form.append("spoiler", "true")
  input.keepImageIds.forEach((id) => form.append("keepImageIds", id))
  input.images.forEach((image, index) =>
    appendImage(form, "images", image, `snacc-${index}`)
  )

  return api.uploadPut<Snacc>(`/snaccs/${input.id}`, form)
}

export async function deleteSnacc(id: string): Promise<void> {
  await api.del(`/snaccs/${id}`)
}

export function getSnacc(id: string): Promise<Snacc> {
  return api.get<Snacc>(`/snaccs/${id}`)
}

export function listComments(
  snaccId: string,
  page: number,
  sort: CommentSort
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(`/snaccs/${snaccId}/comments`, {
    page,
    sort,
  })
}

export async function pinSnacc(snaccId: string): Promise<void> {
  await api.put(`/snaccs/${snaccId}/pin`)
}

export async function unpinSnacc(snaccId: string): Promise<void> {
  await api.del(`/snaccs/${snaccId}/pin`)
}

export async function undoResnacc(snaccId: string): Promise<void> {
  await api.del(`/snaccs/${snaccId}/resnacc`)
}

export interface ReactToSnaccInput {
  snaccId: string
  emoji: string | null
}

export async function reactToSnacc({
  snaccId,
  emoji,
}: ReactToSnaccInput): Promise<void> {
  if (emoji === null) {
    await api.del(`/snaccs/${snaccId}/reactions`)
    return
  }
  await api.put(`/snaccs/${snaccId}/reactions`, { emoji })
}

export function getReactionSummary(snaccId: string): Promise<SnaccReaction[]> {
  return api.get<SnaccReaction[]>(`/snaccs/${snaccId}/reactions/summary`)
}

export function listReactions(
  snaccId: string,
  emoji: string | undefined,
  page: number
): Promise<Paginated<SnaccReactor>> {
  return api.get<Paginated<SnaccReactor>>(`/snaccs/${snaccId}/reactions`, {
    emoji,
    page,
  })
}

export function getResnaccSummary(snaccId: string): Promise<ResnaccSummary> {
  return api.get<ResnaccSummary>(`/snaccs/${snaccId}/resnaccs/summary`)
}

export function listResnaccQuotes(
  snaccId: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(`/snaccs/${snaccId}/resnaccs/quotes`, {
    page,
  })
}

export function listResnaccers(
  snaccId: string,
  page: number
): Promise<Paginated<SnaccResnaccer>> {
  return api.get<Paginated<SnaccResnaccer>>(
    `/snaccs/${snaccId}/resnaccs/people`,
    { page }
  )
}

export function votePoll(
  snaccId: string,
  optionId: string
): Promise<SnaccPoll> {
  return api.post<SnaccPoll>(
    `/snaccs/${encodeURIComponent(snaccId)}/poll/votes`,
    { optionId }
  )
}
