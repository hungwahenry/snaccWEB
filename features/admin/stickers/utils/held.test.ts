import { describe, expect, it } from "vitest"
import { heldPackHref, heldPackName } from "./held"

const pack = {
  id: "p1",
  title: "Exam season",
  kind: "pack" as const,
  status: "published" as const,
}

describe("held sticker packs", () => {
  it("links a pack to its page", () => {
    expect(heldPackHref(pack)).toBe("/admin/sticker-packs/p1")
    expect(heldPackName(pack)).toBe("Exam season")
  })

  it("names Favourites and leaves them unlinked, having no page", () => {
    const favourites = { ...pack, kind: "favourites" as const }
    expect(heldPackHref(favourites)).toBeNull()
    expect(heldPackName(favourites)).toBe("Favourites")
  })
})
