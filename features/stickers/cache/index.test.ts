import { QueryClient } from "@tanstack/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { PaginatedPages } from "@/lib/api/types"
import type {
  Sticker,
  StickerPack,
  StickerPackDetail,
  StickerTray,
} from "../types"
import { stickerKeys } from "../utils/keys"
import { dropSticker, findPack, restoreStickers, setPackSaved } from "."

let client: QueryClient
vi.mock("@/lib/query/client", () => ({ getQueryClient: () => client }))

const sticker = (id: string): Sticker => ({
  id,
  pack_id: "p1",
  source: "upload",
  format: "static",
  url: `https://media.test/${id}.png`,
  preview_url: null,
  width: 512,
  height: 512,
  premium: false,
  held: false,
})

const pack: StickerPack = {
  id: "p1",
  kind: "pack",
  title: "Exam season",
  owner: null,
  status: "published",
  premium: false,
  cover: null,
  stickers_count: 2,
  mine: false,
  saved: false,
}

const detail = (): StickerPackDetail => ({
  ...pack,
  stickers: [sticker("a"), sticker("b")],
})

const catalog = (): PaginatedPages<StickerPack> => ({
  pages: [
    {
      items: [pack, { ...pack, id: "p2" }],
      page: 1,
      last_page: 1,
      per_page: 20,
      total: 2,
    },
  ],
  pageParams: [{ page: 1 }],
})

const tray = (): StickerTray => ({
  favourites: { ...detail(), id: "fav", kind: "favourites", stickers: [] },
  packs: [detail()],
})

beforeEach(() => {
  client = new QueryClient()
  client.setQueryData(stickerKeys.pack("p1"), detail())
  client.setQueryData(stickerKeys.catalog(), catalog())
  client.setQueryData(stickerKeys.tray(), tray())
})

describe("sticker pack cache", () => {
  it("takes a sticker out of its pack and the tray, and puts it back if that fails", () => {
    const previous = dropSticker("p1", "a")

    const dropped = client.getQueryData<StickerPackDetail>(
      stickerKeys.pack("p1")
    )
    expect(dropped?.stickers.map((item) => item.id)).toEqual(["b"])
    expect(dropped?.stickers_count).toBe(1)
    expect(
      client
        .getQueryData<StickerTray>(stickerKeys.tray())
        ?.packs[0].stickers.map((item) => item.id)
    ).toEqual(["b"])

    restoreStickers("p1", previous)
    expect(client.getQueryData(stickerKeys.pack("p1"))).toEqual(detail())
    expect(client.getQueryData(stickerKeys.tray())).toEqual(tray())
  })

  it("finds a pack already in the tray", () => {
    expect(findPack("p1")?.stickers.map((item) => item.id)).toEqual(["a", "b"])
    expect(findPack("nope")).toBeUndefined()
  })

  it("marks a pack added everywhere it shows", () => {
    setPackSaved("p1", true)

    expect(
      client.getQueryData<StickerPackDetail>(stickerKeys.pack("p1"))?.saved
    ).toBe(true)
    expect(
      client
        .getQueryData<PaginatedPages<StickerPack>>(stickerKeys.catalog())
        ?.pages[0].items.map((item) => item.saved)
    ).toEqual([true, false])
  })
})
