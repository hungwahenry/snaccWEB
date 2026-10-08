import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Gif } from "@/features/giphy/types"
import type { Sticker, StickerPack, StickerPackDetail } from "../types"
import { useStickerTray, type StickerTrayOptions } from "./use-sticker-tray"

const flags: Record<string, boolean> = {}
const feedCalls: { kind: string; enabled: boolean }[] = []
const push = vi.fn()
const keep = vi.fn()
const actOn = vi.fn()
const begin = vi.fn()
const notice = vi.fn()
let premium = false

const gif: Gif = {
  id: "g1",
  url: "https://giphy.test/g1.gif",
  preview_url: null,
  width: 200,
  height: 100,
  title: "Wave",
}

const sticker = (over: Partial<Sticker> = {}): Sticker => ({
  id: "s1",
  pack_id: "p1",
  source: "upload",
  format: "static",
  url: "https://media.test/s1.png",
  preview_url: null,
  width: 512,
  height: 512,
  premium: false,
  held: false,
  ...over,
})

const pack = (over: Partial<StickerPack> = {}): StickerPack => ({
  id: "p1",
  kind: "pack",
  title: "Exam season",
  owner: null,
  status: "published",
  premium: false,
  cover: null,
  stickers_count: 3,
  mine: false,
  saved: true,
  ...over,
})

const tray = {
  favourites: pack({
    id: "fav",
    kind: "favourites",
    title: "Favourites",
    mine: true,
    stickers_count: 0,
  }),
  packs: [pack()],
}

const detail: StickerPackDetail = {
  ...pack(),
  stickers: [
    sticker(),
    sticker({ id: "s2", premium: true }),
    sticker({ id: "s3", held: true }),
  ],
}

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))
vi.mock("@/features/config/hooks/use-flag", () => ({
  useFlag: (key: string) => flags[key] ?? false,
}))
vi.mock("@/features/premium/hooks/use-premium-limit", () => ({
  useIsPremium: () => premium,
}))
vi.mock("@/lib/feedback", () => ({
  showNotice: (text: string) => notice(text),
}))
vi.mock("@/features/giphy/hooks/use-giphy-feed", () => ({
  useGiphyFeed: (kind: string, _query: string, enabled: boolean) => {
    feedCalls.push({ kind, enabled })
    return {
      items: [gif],
      searching: false,
      loading: false,
      failed: false,
      retry: vi.fn(),
    }
  },
}))
vi.mock("./use-sticker-packs", () => ({
  useStickerTrayPacks: () => ({
    data: tray,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useStickerPack: (id: string | null) => ({
    data: id === "p1" ? detail : undefined,
    isPending: id !== "p1",
    isError: false,
    refetch: vi.fn(),
  }),
}))
vi.mock("./use-keep-sticker", () => ({ useKeepSticker: () => keep }))
vi.mock("./use-tile-action", () => ({ useTileAction: () => actOn }))
vi.mock("./use-sticker-creator", () => ({
  useStickerCreator: () => ({ begin }),
}))

function setup(overrides: Partial<StickerTrayOptions> = {}) {
  const options: StickerTrayOptions = {
    open: true,
    onOpenChange: vi.fn(),
    onPickSticker: vi.fn(),
    onPickGif: vi.fn(),
    ...overrides,
  }
  const hook = renderHook(() => useStickerTray(options))
  return { ...hook, options }
}

beforeEach(() => {
  flags.stickers = true
  flags.giphy = true
  premium = false
  feedCalls.length = 0
  vi.clearAllMocks()
})

describe("useStickerTray", () => {
  it("opens on the first pack when Favourites is empty", () => {
    const { result } = setup()

    expect(result.current.tab).toBe("stickers")
    expect(result.current.shelf?.selectedId).toBe("p1")
    expect(result.current.panel?.title).toBe("Exam season")
    expect(result.current.panel?.onCreate).toBeUndefined()
    expect(feedCalls.at(-1)?.enabled).toBe(false)
  })

  it("sends a pack sticker by its id and closes", () => {
    const { result, options } = setup()

    act(() => result.current.panel?.onPick(result.current.panel.tiles[0]))

    expect(options.onOpenChange).toHaveBeenCalledWith(false)
    expect(options.onPickSticker).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "pack", stickerId: "s1" })
    )
  })

  it("sends a Premium sticker's tap to the Premium page instead", () => {
    const { result, options } = setup()

    act(() => result.current.panel?.onPick(result.current.panel.tiles[1]))

    expect(options.onPickSticker).not.toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith("/premium")
  })

  it("lets the screen settle first before leaving for another page", () => {
    const beforeLeaving = vi.fn()
    const { result } = setup({ beforeLeaving })

    act(() => result.current.shelf?.onBrowse())

    expect(push).not.toHaveBeenCalled()
    act(() => beforeLeaving.mock.calls[0][0]())
    expect(push).toHaveBeenCalledWith("/stickers")
  })

  it("never sends a sticker under review", () => {
    const { result, options } = setup()

    act(() => result.current.panel?.onPick(result.current.panel.tiles[2]))

    expect(options.onPickSticker).not.toHaveBeenCalled()
    expect(notice).toHaveBeenCalled()
  })

  it("offers to create a sticker in Favourites", () => {
    const { result } = setup()

    act(() => result.current.shelf?.onSelect("fav"))
    act(() => result.current.panel?.onCreate?.())

    expect(begin).toHaveBeenCalledWith("fav")
  })

  it("sends a Giphy sticker straight, saving nothing", () => {
    const { result, options } = setup()

    act(() => result.current.onTabChange("giphy"))
    expect(feedCalls.at(-1)).toEqual({ kind: "stickers", enabled: true })

    act(() => result.current.grid?.onPick("g1"))
    expect(options.onPickSticker).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "giphy", giphyId: "g1" })
    )
    expect(keep).not.toHaveBeenCalled()

    act(() => result.current.grid?.onKeep?.("g1"))
    expect(keep).toHaveBeenCalledWith({ giphyId: "g1" })
  })

  it("hands over the GIF itself on the GIFs tab", () => {
    const { result, options } = setup()

    act(() => result.current.onTabChange("gifs"))
    act(() => result.current.grid?.onPick("g1"))

    expect(options.onPickGif).toHaveBeenCalledWith(gif)
    expect(result.current.grid?.onKeep).toBeUndefined()
  })

  it("is a GIF picker when the screen takes only GIFs", () => {
    const { result } = setup({ onPickSticker: undefined })

    expect(result.current.tabs.map((tab) => tab.value)).toEqual(["gifs"])
    expect(result.current.shelf).toBeNull()
  })
})
