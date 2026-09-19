import { describe, expect, it } from "vitest"
import type { Snacc } from "@/features/snaccs/types"
import {
  clipFit,
  isReadyClip,
  livePages,
  ownsKey,
  pageAt,
  upcomingPosters,
  viewerKey,
  viewerQueue,
  wantsMore,
  type PlayableClip,
} from "./viewer"

const clip = (id: string, status: "ready" | "processing" = "ready") =>
  ({
    id,
    clip: {
      id,
      status,
      hls_url:
        status === "ready" ? `https://stream/${id}/manifest/video.m3u8` : null,
      poster_url: `https://cdn/${id}.jpg`,
      poster_thumb_url: `https://cdn/${id}-thumb.jpg`,
      width: 720,
      height: 1280,
      duration_ms: 5_000,
    },
  }) as unknown as Snacc

const words = (id: string) => ({ id, clip: null }) as unknown as Snacc

describe("isReadyClip", () => {
  it("needs a finished clip with somewhere to stream from", () => {
    expect(isReadyClip(clip("a").clip)).toBe(true)
    expect(isReadyClip(clip("a", "processing").clip)).toBe(false)
    expect(isReadyClip(null)).toBe(false)
  })
})

describe("viewerQueue", () => {
  it("opens on the clip you clicked, then carries on without repeating it", () => {
    const queue = viewerQueue(clip("b"), [clip("a"), clip("b"), clip("c")])
    expect(queue.map((snacc) => snacc.id)).toEqual(["b", "a", "c"])
  })

  it("leaves out anything that cannot play yet", () => {
    const queue = viewerQueue(clip("a", "processing"), [
      words("w"),
      clip("p", "processing"),
      clip("c"),
    ])
    expect(queue.map((snacc) => snacc.id)).toEqual(["c"])
  })
})

describe("wantsMore", () => {
  it("asks for the next page a few clips before the end", () => {
    expect(wantsMore(0, 10)).toBe(false)
    expect(wantsMore(7, 10)).toBe(true)
  })
})

describe("clipFit", () => {
  it("fills the page with a tall clip and letterboxes a wide one", () => {
    expect(clipFit({ width: 720, height: 1280 })).toBe("cover")
    expect(clipFit({ width: 1280, height: 720 })).toBe("contain")
    expect(clipFit({ width: 0, height: 0 })).toBe("contain")
  })
})

describe("upcomingPosters", () => {
  it("lists the covers of the next few clips", () => {
    const queue = ["a", "b", "c", "d", "e"].map((id) =>
      clip(id)
    ) as PlayableClip[]
    expect(upcomingPosters(queue, 0)).toEqual([
      "https://cdn/b.jpg",
      "https://cdn/c.jpg",
      "https://cdn/d.jpg",
    ])
    expect(upcomingPosters(queue, 4)).toEqual([])
  })
})

describe("pageAt", () => {
  it("switches to the next page once it covers half the screen", () => {
    expect(pageAt(0, 800, 5)).toBe(0)
    expect(pageAt(399, 800, 5)).toBe(0)
    expect(pageAt(400, 800, 5)).toBe(1)
    expect(pageAt(1600, 800, 5)).toBe(2)
  })

  it("stays inside the pages there are", () => {
    expect(pageAt(-50, 800, 5)).toBe(0)
    expect(pageAt(99_999, 800, 5)).toBe(4)
    expect(pageAt(100, 0, 5)).toBe(0)
    expect(pageAt(100, 800, 0)).toBe(0)
  })
})

describe("livePages", () => {
  it("keeps the clip on screen and the ones either side of it live", () => {
    expect(livePages(4, 10).toSorted()).toEqual([3, 4, 5])
  })

  it("gives a page the same seat for as long as it is live", () => {
    expect(livePages(1, 10)).toEqual([0, 1, 2])
    expect(livePages(2, 10)).toEqual([3, 1, 2])
    expect(livePages(3, 10)).toEqual([3, 4, 2])
  })

  it("leaves a seat empty at either end", () => {
    expect(livePages(0, 10)).toEqual([0, 1, null])
    expect(livePages(9, 10)).toEqual([9, null, 8])
    expect(livePages(0, 0)).toEqual([null, null, null])
  })
})

describe("viewerKey", () => {
  it("reads the keys the viewer answers to", () => {
    expect(viewerKey("ArrowDown")).toBe("next")
    expect(viewerKey("k")).toBe("previous")
    expect(viewerKey(" ")).toBe("pause")
    expect(viewerKey("m")).toBe("mute")
    expect(viewerKey("Escape")).toBe("close")
    expect(viewerKey("x")).toBeNull()
  })
})

describe("ownsKey", () => {
  const inside = (html: string, selector: string) => {
    document.body.innerHTML = html
    return document.querySelector(selector)
  }

  it("leaves every key to someone typing or working in a sheet", () => {
    expect(ownsKey(inside("<input />", "input"), "next")).toBe(true)
    expect(
      ownsKey(inside('<div role="dialog"><p>hi</p></div>', "p"), "close")
    ).toBe(true)
    expect(ownsKey(inside('<div role="slider"></div>', "div"), "next")).toBe(
      true
    )
  })

  it("lets space press the button it is on, but still pages from there", () => {
    const button = inside("<button>React</button>", "button")
    expect(ownsKey(button, "pause")).toBe(true)
    expect(ownsKey(button, "next")).toBe(false)
  })

  it("takes keys pressed anywhere else", () => {
    expect(ownsKey(inside("<main></main>", "main"), "pause")).toBe(false)
    expect(ownsKey(null, "pause")).toBe(false)
  })
})
