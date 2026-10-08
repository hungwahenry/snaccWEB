"use client"

import { useRouter } from "next/navigation"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { stickerPackPath } from "@/features/admin/shell/routes"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import {
  LISTED_FILTERS,
  OWNER_FILTERS,
  packListQuery,
  STATUS_FILTERS,
} from "../utils/packs"
import { useStickerPackActions, useStickerPacks } from "./use-sticker-packs"

const FILTERS = {
  q: parseAsString.withDefault(""),
  owner: parseAsStringLiteral(OWNER_FILTERS),
  status: parseAsStringLiteral(STATUS_FILTERS),
  listed: parseAsStringLiteral(LISTED_FILTERS),
}

export function useStickerPacksScreen() {
  const router = useRouter()
  const list = useListParams(FILTERS)
  const query = useStickerPacks(packListQuery(list.query, PAGE_SIZE))
  const actions = useStickerPackActions()

  async function create(title: string) {
    const pack = await actions.create(title)
    router.push(stickerPackPath(pack.id))
  }

  return { list, query, create }
}
