export const snaccPath = (id: string) => `/snacc/${id}`
export const resnaccsPath = (id: string) => `/resnaccs/${id}`
export const editSnaccPath = (id: string) =>
  `/compose?edit=${encodeURIComponent(id)}`

export function composePath(
  params: {
    parentId?: string
    resnaccOfId?: string
    initialBody?: string
    draftId?: string
  } = {}
): string {
  const search = new URLSearchParams()
  if (params.draftId) search.set("draft", params.draftId)
  if (params.parentId) search.set("parentId", params.parentId)
  if (params.resnaccOfId) search.set("resnaccOfId", params.resnaccOfId)
  if (params.initialBody) search.set("initialBody", params.initialBody)
  const qs = search.toString()
  return qs ? `/compose?${qs}` : "/compose"
}
