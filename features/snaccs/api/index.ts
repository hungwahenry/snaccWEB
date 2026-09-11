import { voiceFileName } from "@/features/voice/utils/recording"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage } from "@/lib/media"
import type {
  CommentSort,
  CreateSnaccInput,
  EditSnaccInput,
  PollPayload,
  ReactToSnaccInput,
  ResnaccSummary,
  Snacc,
  SnaccPoll,
  SnaccReaction,
  SnaccReactor,
  SnaccResnaccer,
} from "../types"

const snaccUrl = (id: string) => `/snaccs/${encodeURIComponent(id)}`

function pollField(poll: PollPayload | undefined): string | undefined {
  return poll
    ? JSON.stringify({
        options: poll.options,
        duration_minutes: poll.durationMinutes,
      })
    : undefined
}

export function createSnacc(input: CreateSnaccInput): Promise<Snacc> {
  const multipart =
    (input.images?.length ?? 0) > 0 ||
    (input.poll?.images?.length ?? 0) > 0 ||
    input.voice !== undefined

  if (!multipart) {
    return api.post<Snacc>("/snaccs", {
      id: input.id,
      body: input.body,
      giphyId: input.giphyId,
      stickerId: input.stickerId,
      matchId: input.matchId,
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
    ["stickerId", input.stickerId],
    ["matchId", input.matchId],
    ["spoiler", input.spoiler ? "true" : undefined],
    ["poll", pollField(input.poll)],
    [
      "voiceDurationMs",
      input.voice ? String(input.voice.durationMs) : undefined,
    ],
  ]
  fields.forEach(([name, value]) => {
    if (value) form.append(name, value)
  })
  if (input.voice)
    form.append("voice", input.voice.file, voiceFileName(input.voice.mimeType))
  input.poll?.images?.forEach((image, index) =>
    appendImage(form, "pollImages", image, `poll-${index}`)
  )
  input.images?.forEach((image, index) =>
    appendImage(form, "images", image, `snacc-${index}`)
  )

  return api.upload<Snacc>("/snaccs", form)
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

  return api.uploadPut<Snacc>(snaccUrl(input.id), form)
}

export async function deleteSnacc(id: string): Promise<void> {
  await api.del(snaccUrl(id))
}

export function getSnacc(id: string): Promise<Snacc> {
  return api.get<Snacc>(snaccUrl(id))
}

export function listComments(
  snaccId: string,
  page: number,
  sort: CommentSort
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(`${snaccUrl(snaccId)}/comments`, {
    page,
    sort,
  })
}

export async function pinSnacc(snaccId: string): Promise<void> {
  await api.put(`${snaccUrl(snaccId)}/pin`)
}

export async function unpinSnacc(snaccId: string): Promise<void> {
  await api.del(`${snaccUrl(snaccId)}/pin`)
}

export async function undoResnacc(snaccId: string): Promise<void> {
  await api.del(`${snaccUrl(snaccId)}/resnacc`)
}

export async function reactToSnacc({
  snaccId,
  emoji,
}: ReactToSnaccInput): Promise<void> {
  if (emoji === null) {
    await api.del(`${snaccUrl(snaccId)}/reactions`)
    return
  }
  await api.put(`${snaccUrl(snaccId)}/reactions`, { emoji })
}

export function getReactionSummary(snaccId: string): Promise<SnaccReaction[]> {
  return api.get<SnaccReaction[]>(`${snaccUrl(snaccId)}/reactions/summary`)
}

export function listReactions(
  snaccId: string,
  emoji: string | undefined,
  page: number
): Promise<Paginated<SnaccReactor>> {
  return api.get<Paginated<SnaccReactor>>(`${snaccUrl(snaccId)}/reactions`, {
    emoji,
    page,
  })
}

export function getResnaccSummary(snaccId: string): Promise<ResnaccSummary> {
  return api.get<ResnaccSummary>(`${snaccUrl(snaccId)}/resnaccs/summary`)
}

export function listResnaccQuotes(
  snaccId: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(`${snaccUrl(snaccId)}/resnaccs/quotes`, {
    page,
  })
}

export function listResnaccers(
  snaccId: string,
  page: number
): Promise<Paginated<SnaccResnaccer>> {
  return api.get<Paginated<SnaccResnaccer>>(
    `${snaccUrl(snaccId)}/resnaccs/people`,
    { page }
  )
}

export function votePoll(
  snaccId: string,
  optionId: string
): Promise<SnaccPoll> {
  return api.post<SnaccPoll>(`${snaccUrl(snaccId)}/poll/votes`, { optionId })
}
