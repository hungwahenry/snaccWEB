import { describe, expect, it } from "vitest"
import {
  columnsOf,
  shownTab,
  trayEmpty,
  trayItemLabel,
  traySearchPlaceholder,
  trayTabs,
  trayTitle,
} from "./tray"

const values = (tabs: { value: string }[]) => tabs.map((tab) => tab.value)

describe("trayTabs", () => {
  it("offers stickers, GIFs and saved stickers when both are on", () => {
    expect(values(trayTabs({ stickers: true, gifs: true }))).toEqual([
      "stickers",
      "gifs",
      "mine",
    ])
  })

  it("offers only GIFs when stickers are off", () => {
    expect(values(trayTabs({ stickers: false, gifs: true }))).toEqual(["gifs"])
  })

  it("offers only stickers and saved ones when GIFs are off", () => {
    expect(values(trayTabs({ stickers: true, gifs: false }))).toEqual([
      "stickers",
      "mine",
    ])
  })
})

describe("trayTitle", () => {
  it("is Stickers when stickers are on offer, else GIFs", () => {
    expect(trayTitle(trayTabs({ stickers: true, gifs: true }))).toBe("Stickers")
    expect(trayTitle(trayTabs({ stickers: false, gifs: true }))).toBe("GIFs")
  })
})

describe("shownTab", () => {
  const both = trayTabs({ stickers: true, gifs: true })
  const gifsOnly = trayTabs({ stickers: false, gifs: true })

  it("starts on the first tab on offer", () => {
    expect(shownTab(both, null)).toBe("stickers")
    expect(shownTab(gifsOnly, null)).toBe("gifs")
  })

  it("keeps the picked tab", () => {
    expect(shownTab(both, "mine")).toBe("mine")
  })

  it("moves off a tab that is no longer on offer", () => {
    expect(shownTab(gifsOnly, "mine")).toBe("gifs")
  })
})

describe("trayEmpty", () => {
  it("says nothing matched for a search on a Giphy tab", () => {
    expect(trayEmpty("stickers", true).title).toBe("Nothing matched")
    expect(trayEmpty("gifs", true).title).toBe("Nothing matched")
  })

  it("names what's missing when there's no search", () => {
    expect(trayEmpty("stickers", false).title).toBe("No stickers right now")
    expect(trayEmpty("gifs", false).title).toBe("No GIFs right now")
  })

  it("explains how to fill the saved tab", () => {
    expect(trayEmpty("mine", true)).toMatchObject({
      title: "Nothing saved yet",
      description: "Hold any sticker to keep it here.",
    })
  })
})

describe("tray copy", () => {
  it("has a search box only on the Giphy tabs", () => {
    expect(traySearchPlaceholder("stickers")).toBe("Search stickers")
    expect(traySearchPlaceholder("gifs")).toBe("Search GIFs")
    expect(traySearchPlaceholder("mine")).toBeNull()
  })

  it("labels tiles by what they are", () => {
    expect(trayItemLabel("gifs")).toBe("GIF")
    expect(trayItemLabel("stickers")).toBe("Sticker")
    expect(trayItemLabel("mine")).toBe("Sticker")
  })
})

describe("columnsOf", () => {
  it("deals items across columns in order", () => {
    expect(columnsOf([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 3, 5],
      [2, 4],
    ])
  })

  it("always has at least one column", () => {
    expect(columnsOf([1, 2], 0)).toEqual([[1, 2]])
  })

  it("keeps empty columns for an empty list", () => {
    expect(columnsOf([], 2)).toEqual([[], []])
  })
})
