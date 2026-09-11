import type { ComposeParams } from "./types"

export const COMPOSE_PATH = "/compose"

export const snaccPath = (id: string) => `/snacc/${encodeURIComponent(id)}`
export const resnaccsPath = (id: string) =>
  `/resnaccs/${encodeURIComponent(id)}`
export const editSnaccPath = (id: string) =>
  `${COMPOSE_PATH}?edit=${encodeURIComponent(id)}`

export function composePath(params: ComposeParams = {}): string {
  const search = new URLSearchParams()
  if (params.draftId) search.set("draft", params.draftId)
  if (params.parentId) search.set("parentId", params.parentId)
  if (params.resnaccOfId) search.set("resnaccOfId", params.resnaccOfId)
  if (params.initialBody) search.set("initialBody", params.initialBody)
  if (params.matchId) search.set("matchId", params.matchId)
  const qs = search.toString()
  return qs ? `${COMPOSE_PATH}?${qs}` : COMPOSE_PATH
}
