import { describe, expect, it } from "vitest"
import type { AdButton } from "../types"
import {
  buttonDraftFrom,
  isButtonDraftReady,
  sortButtons,
  toCreateButtonInput,
} from "./ad-buttons"

const button: AdButton = {
  id: "b1",
  slug: "shop_now",
  label: "Shop now",
  position: 2,
  retired: false,
  created_at: "2026-01-01T00:00:00Z",
}

describe("ad button drafts", () => {
  it("starts new labels empty", () => {
    expect(buttonDraftFrom()).toEqual({ slug: "", label: "", position: "0" })
    expect(buttonDraftFrom(button)).toEqual({
      slug: "shop_now",
      label: "Shop now",
      position: "2",
    })
  })

  it("needs a slug, a label and a sensible position", () => {
    expect(isButtonDraftReady(buttonDraftFrom(button))).toBe(true)
    expect(isButtonDraftReady({ ...buttonDraftFrom(button), label: " " })).toBe(
      false
    )
    expect(
      isButtonDraftReady({ ...buttonDraftFrom(button), position: "-1" })
    ).toBe(false)
  })

  it("trims what it sends", () => {
    expect(
      toCreateButtonInput({
        slug: " order_now ",
        label: " Order now ",
        position: "3",
      })
    ).toEqual({ slug: "order_now", label: "Order now", position: 3 })
  })
})

describe("sortButtons", () => {
  it("puts live labels first, in their order", () => {
    const retired = { ...button, id: "b0", position: 0, retired: true }
    const first = { ...button, id: "b2", position: 1 }
    expect(sortButtons([retired, button, first]).map((b) => b.id)).toEqual([
      "b2",
      "b1",
      "b0",
    ])
  })
})
