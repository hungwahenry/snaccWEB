import { QueryClient } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { PaginatedPages } from "@/lib/api/types"
import type { Sticker } from "../types"
import { stickerKeys } from "../utils/keys"
import { dropFromLibrary, refreshStickerLibrary, restoreLibrary } from "."

let client: QueryClient
vi.mock("@/lib/query/client", () => ({ getQueryClient: () => client }))

const sticker = (id: string): Sticker => ({
  id,
  kind: "custom",
  url: `https://media.test/${id}.png`,
  preview_url: null,
  width: 512,
  height: 512,
})

const library = (): PaginatedPages<Sticker> => ({
  pages: [
    {
      items: [sticker("a"), sticker("b")],
      page: 1,
      last_page: 1,
      per_page: 50,
      total: 2,
    },
  ],
  pageParams: [1],
})

beforeEach(() => {
  client = new QueryClient()
  client.setQueryData(stickerKeys.library(), library())
})

describe("sticker library cache", () => {
  it("drops a sticker and fixes the total", () => {
    dropFromLibrary("a")

    const data = client.getQueryData<PaginatedPages<Sticker>>(
      stickerKeys.library()
    )
    expect(data?.pages[0].items.map((item) => item.id)).toEqual(["b"])
    expect(data?.pages[0].total).toBe(1)
  })

  it("puts the library back when the delete fails", () => {
    const previous = dropFromLibrary("a")
    restoreLibrary(previous)

    expect(client.getQueryData(stickerKeys.library())).toEqual(library())
  })

  it("marks the library stale so it refetches", () => {
    refreshStickerLibrary()

    expect(client.getQueryState(stickerKeys.library())?.isInvalidated).toBe(
      true
    )
  })
})
