import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { filterItems } from "@/lib/query/pages"
import type { Sticker } from "../types"
import { stickerKeys } from "../utils/keys"

export function refreshStickerLibrary(): void {
  void getQueryClient().invalidateQueries({ queryKey: stickerKeys.library() })
}

/** Takes a sticker out of the library at once; returns what to put back if the delete fails. */
export function dropFromLibrary(
  id: string
): PaginatedPages<Sticker> | undefined {
  const client = getQueryClient()
  const key = stickerKeys.library()
  const previous = client.getQueryData<PaginatedPages<Sticker>>(key)
  client.setQueryData<PaginatedPages<Sticker>>(key, (data) =>
    filterItems(data, (sticker) => sticker.id !== id)
  )
  return previous
}

export function restoreLibrary(
  previous: PaginatedPages<Sticker> | undefined
): void {
  getQueryClient().setQueryData(stickerKeys.library(), previous)
}
