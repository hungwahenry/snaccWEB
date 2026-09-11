import { afterEach, describe, expect, it, vi } from "vitest"
import { isShareCancel, shareOrDownload } from "./share-file"

const file = () => new File(["hi"], "card.png", { type: "image/png" })

describe("shareOrDownload", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("uses the share sheet when the browser can share files", async () => {
    const share = vi.fn(() => Promise.resolve())
    vi.stubGlobal("navigator", { share, canShare: () => true })
    await shareOrDownload(file())
    expect(share).toHaveBeenCalledOnce()
  })

  it("stays quiet when the person closes the share sheet", async () => {
    const cancel = Object.assign(new Error("closed"), { name: "AbortError" })
    vi.stubGlobal("navigator", {
      share: () => Promise.reject(cancel),
      canShare: () => true,
    })
    await expect(shareOrDownload(file())).resolves.toBeUndefined()
  })

  it("downloads when there is no share sheet", async () => {
    vi.stubGlobal("navigator", {})
    URL.createObjectURL = vi.fn(() => "blob:x")
    URL.revokeObjectURL = vi.fn()
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined)
    await shareOrDownload(file())
    expect(click).toHaveBeenCalledOnce()
  })
})

describe("isShareCancel", () => {
  it("recognises a closed share sheet", () => {
    expect(isShareCancel({ name: "AbortError" })).toBe(true)
    expect(isShareCancel(new Error("x"))).toBe(false)
    expect(isShareCancel(null)).toBe(false)
  })
})
