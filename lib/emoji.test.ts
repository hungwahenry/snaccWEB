import { describe, expect, it } from "vitest"
import {
  emojisFor,
  QUICK_CATEGORY,
  searchEmojis,
  type Catalog,
  type CatalogEmoji,
} from "./emoji"

const pizza: CatalogEmoji = { emoji: "🍕", name: "pizza", keywords: ["food"] }
const burger: CatalogEmoji = {
  emoji: "🍔",
  name: "hamburger",
  keywords: ["burger", "food"],
}
const ball: CatalogEmoji = {
  emoji: "⚽",
  name: "soccer ball",
  keywords: ["football"],
}

const catalog: Catalog = {
  byCategory: new Map([
    ["food_drink", [pizza, burger]],
    ["activities", [ball]],
  ]),
  all: [pizza, burger, ball],
}

describe("emoji catalogue", () => {
  it("shows the quick picks it is given, in order", () => {
    expect(
      emojisFor(null, QUICK_CATEGORY, ["⚽", "🍕"]).map((each) => each.emoji)
    ).toEqual(["⚽", "🍕"])
  })

  it("lists a category once the catalogue is loaded", () => {
    expect(emojisFor(catalog, "activities", [])).toEqual([ball])
    expect(emojisFor(null, "activities", [])).toEqual([])
  })

  it("ranks a name match ahead of a keyword match", () => {
    expect(searchEmojis(catalog, "burger").map((each) => each.emoji)).toEqual([
      "🍔",
    ])
    expect(searchEmojis(catalog, "food").map((each) => each.emoji)).toEqual([
      "🍕",
      "🍔",
    ])
    expect(searchEmojis(catalog, "  ")).toEqual([])
  })
})
