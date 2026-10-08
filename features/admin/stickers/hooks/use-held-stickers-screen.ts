"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import {
  useHeldStickers,
  useStickerModerationActions,
} from "./use-sticker-moderation"

const FILTERS = {
  q: parseAsString.withDefault(""),
}

export function useHeldStickersScreen() {
  const list = useListParams(FILTERS)
  const query = useHeldStickers({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q.trim() || undefined,
  })

  return { list, query, actions: useStickerModerationActions() }
}
