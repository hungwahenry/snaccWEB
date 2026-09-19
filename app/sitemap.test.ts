import { afterEach, describe, expect, it, vi } from "vitest"
import sitemap from "./sitemap"

const ok = (data: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ data }) })

function api(routes: Record<string, unknown>) {
  const fetcher = vi.fn((url: string) => {
    const path = url.split("/api/v1")[1]
    return path in routes
      ? ok(routes[path])
      : Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  })
  vi.stubGlobal("fetch", fetcher)
  return fetcher
}

const urls = async () => (await sitemap()).map((entry) => entry.url)

describe("sitemap", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("lists every campus, however many pages they come in", async () => {
    api({
      "/pages": [{ slug: "terms" }],
      "/universities?perPage=100&page=1": {
        items: [{ slug: "unilag" }, { slug: "ui" }],
        page: 1,
        last_page: 2,
      },
      "/universities?perPage=100&page=2": {
        items: [{ slug: "oau" }],
        page: 2,
        last_page: 2,
      },
    })

    expect(await urls()).toEqual([
      "https://snacc.fyi",
      "https://snacc.fyi/download",
      "https://snacc.fyi/campus/unilag",
      "https://snacc.fyi/campus/ui",
      "https://snacc.fyi/campus/oau",
      "https://snacc.fyi/terms",
    ])
  })

  it("still lists the fixed pages when the API is down", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch")))
    )

    expect(await urls()).toEqual([
      "https://snacc.fyi",
      "https://snacc.fyi/download",
    ])
  })

  it("stops asking once a page fails, and keeps what it has", async () => {
    const fetcher = api({
      "/universities?perPage=100&page=1": {
        items: [{ slug: "unilag" }],
        page: 1,
        last_page: 9,
      },
    })

    expect(await urls()).toContain("https://snacc.fyi/campus/unilag")
    expect(
      fetcher.mock.calls.filter(([url]) => url.includes("/universities"))
    ).toHaveLength(2)
  })
})
