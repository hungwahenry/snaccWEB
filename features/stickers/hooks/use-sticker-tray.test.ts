import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Gif } from "@/features/giphy/types"
import type { Sticker } from "../types"
import { useStickerTray, type StickerTrayOptions } from "./use-sticker-tray"

const flags: Record<string, boolean> = {}
const feedCalls: { kind: string; query: string; enabled: boolean }[] = []
const libraryCalls: boolean[] = []
const sendGiphy = vi.fn()
const keepGiphy = vi.fn()
const remove = vi.fn()

const gif: Gif = {
  id: "g1",
  url: "https://giphy.test/g1.gif",
  preview_url: null,
  width: 200,
  height: 200,
  title: "Dancing cat",
}
const sticker: Sticker = {
  id: "s1",
  kind: "custom",
  url: "https://media.test/s1.png",
  preview_url: null,
  width: 512,
  height: 512,
}

vi.mock("@/features/config/hooks/use-flag", () => ({
  useFlag: (key: string) => flags[key] ?? false,
}))
vi.mock("@/features/giphy/hooks/use-giphy-feed", () => ({
  useGiphyFeed: (kind: string, query: string, enabled: boolean) => {
    feedCalls.push({ kind, query, enabled })
    return {
      items: [gif],
      searching: query.trim().length > 0,
      loading: false,
      failed: false,
      retry: vi.fn(),
    }
  },
}))
vi.mock("./use-sticker-library", () => ({
  useStickerLibrary: (enabled: boolean) => {
    libraryCalls.push(enabled)
    return {
      stickers: [sticker],
      loading: false,
      loadingMore: false,
      failed: false,
      hasMore: false,
      retry: vi.fn(),
      loadMore: vi.fn(),
    }
  },
}))
vi.mock("./use-keep-sticker", () => ({
  useKeepGiphySticker: () => keepGiphy,
}))
vi.mock("./use-remove-sticker", () => ({ useRemoveSticker: () => remove }))
vi.mock("./use-send-giphy-sticker", () => ({
  useSendGiphySticker: () => sendGiphy,
}))

function setup(overrides: Partial<StickerTrayOptions> = {}) {
  const options: StickerTrayOptions = {
    open: true,
    onOpenChange: vi.fn(),
    onPickSticker: vi.fn(),
    onPickGif: vi.fn(),
    ...overrides,
  }
  const hook = renderHook(
    (props: StickerTrayOptions) => useStickerTray(props),
    {
      initialProps: options,
    }
  )
  return { ...hook, options }
}

beforeEach(() => {
  flags.stickers = true
  flags.giphy = true
  feedCalls.length = 0
  libraryCalls.length = 0
  vi.clearAllMocks()
})

describe("useStickerTray", () => {
  it("starts on Giphy stickers when stickers are on", () => {
    const { result } = setup()

    expect(result.current.tabs.map((tab) => tab.value)).toEqual([
      "stickers",
      "gifs",
      "mine",
    ])
    expect(result.current.tab).toBe("stickers")
    expect(result.current.title).toBe("Stickers")
    expect(feedCalls.at(-1)).toMatchObject({ kind: "stickers", enabled: true })
  })

  it("is a GIF picker when the screen takes only GIFs", () => {
    const { result } = setup({ onPickSticker: undefined })

    expect(result.current.tabs.map((tab) => tab.value)).toEqual(["gifs"])
    expect(result.current.title).toBe("GIFs")
    expect(feedCalls.at(-1)).toMatchObject({ kind: "gifs" })
  })

  it("saves a Giphy sticker and closes when one is picked", () => {
    const { result, options } = setup()

    act(() => result.current.grid.onPick("g1"))

    expect(options.onOpenChange).toHaveBeenCalledWith(false)
    expect(sendGiphy).toHaveBeenCalledWith("g1")
  })

  it("hands over the GIF itself on the GIFs tab", () => {
    const { result, options } = setup()

    act(() => result.current.onTabChange("gifs"))
    act(() => result.current.grid.onPick("g1"))

    expect(options.onPickGif).toHaveBeenCalledWith(gif)
    expect(result.current.grid.onHold).toBeUndefined()
  })

  it("sends a saved sticker from Mine, and holding one offers to remove it", () => {
    const { result, options } = setup()

    act(() => result.current.onTabChange("mine"))
    expect(libraryCalls.at(-1)).toBe(true)
    expect(result.current.searchPlaceholder).toBeNull()
    expect(result.current.showAttribution).toBe(false)

    act(() => result.current.grid.onPick("s1"))
    expect(options.onPickSticker).toHaveBeenCalledWith(sticker)

    act(() => result.current.grid.onHold?.("s1"))
    expect(remove).toHaveBeenCalledWith("s1")
  })

  it("offers to keep a Giphy sticker on hold", () => {
    const { result } = setup()

    act(() => result.current.grid.onHold?.("g1"))

    expect(keepGiphy).toHaveBeenCalledWith("g1")
  })

  it("clears the search when the tab changes or the tray closes", () => {
    const { result, rerender, options } = setup()

    act(() => result.current.onQueryChange("cat"))
    act(() => result.current.onTabChange("gifs"))
    expect(result.current.query).toBe("")

    act(() => result.current.onQueryChange("dog"))
    rerender({ ...options, open: false })
    expect(result.current.query).toBe("")
  })

  it("fetches nothing while closed", () => {
    setup({ open: false })

    expect(feedCalls.at(-1)?.enabled).toBe(false)
    expect(libraryCalls.at(-1)).toBe(false)
  })
})
