import { describe, expect, it } from "vitest"
import { withLike } from "./likes"

const item = (liked: boolean, likes_count: number) => ({
  id: "s1",
  liked,
  likes_count,
})

describe("withLike", () => {
  it("counts a new like and marks it yours", () => {
    expect(withLike(item(false, 3), true)).toEqual({
      id: "s1",
      liked: true,
      likes_count: 4,
    })
  })

  it("takes a like back", () => {
    expect(withLike(item(true, 3), false)).toEqual({
      id: "s1",
      liked: false,
      likes_count: 2,
    })
  })

  it("leaves the item alone when nothing changes", () => {
    const liked = item(true, 3)

    expect(withLike(liked, true)).toBe(liked)
  })

  it("never counts below zero", () => {
    expect(withLike(item(true, 0), false).likes_count).toBe(0)
  })
})
