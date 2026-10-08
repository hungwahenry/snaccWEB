import { describe, expect, it } from "vitest"
import type { ChatTheme, WornTheme } from "../types"
import { choiceFor, pickerState } from "./picker"

const theme = (id: string, extra: Partial<ChatTheme> = {}): ChatTheme =>
  ({
    id,
    key: id,
    label: id,
    kind: "preset",
    premium: false,
    ...extra,
  }) as ChatTheme

const free = theme("free")
const paid = theme("paid", { premium: true })
const night = theme("night", { kind: "photo", premium: true })
const catalog = [free, paid, night]
const wornNight: WornTheme = { ...night, photo_url: "https://cdn/old.jpg" }

describe("pickerState", () => {
  it("hides Premium themes where Premium is not on sale, unless you already have it", () => {
    const base = { catalog, worn: null, picked: null }
    expect(
      pickerState({ ...base, premium: false, premiumOnSale: false }).themes.map(
        (t) => t.id
      )
    ).toEqual(["free"])
    expect(
      pickerState({ ...base, premium: true, premiumOnSale: false }).themes
    ).toHaveLength(3)
    expect(
      pickerState({ ...base, premium: false, premiumOnSale: true }).themes
    ).toHaveLength(3)
  })

  it("starts on what the chat wears and keeps its photo", () => {
    const state = pickerState({
      catalog,
      worn: wornNight,
      picked: null,
      premium: true,
      premiumOnSale: true,
    })
    expect(state.selected?.id).toBe("night")
    expect(state.photoUrl).toBe("https://cdn/old.jpg")
    expect(state.changed).toBe(false)
  })

  it("locks a Premium pick for someone without Premium", () => {
    const state = pickerState({
      catalog,
      worn: null,
      picked: { themeId: "paid", photo: null },
      premium: false,
      premiumOnSale: true,
    })
    expect(state.locked).toBe(true)
    expect(state.changed).toBe(true)
  })

  it("counts a new photo as a change even on the same theme", () => {
    const state = pickerState({
      catalog,
      worn: wornNight,
      picked: { themeId: "night", photo: { uri: "blob:new" } },
      premium: true,
      premiumOnSale: true,
    })
    expect(state.photoUrl).toBe("blob:new")
    expect(state.changed).toBe(true)
  })

  it("does not count picking the worn theme again as a change", () => {
    const state = pickerState({
      catalog,
      worn: { ...free, photo_url: null },
      picked: { themeId: "free", photo: null },
      premium: false,
      premiumOnSale: false,
    })
    expect(state.changed).toBe(false)
  })
})

describe("choiceFor", () => {
  it("keeps a chosen photo only for photo themes", () => {
    const picked = { themeId: "night", photo: { uri: "blob:new" } }
    expect(choiceFor(night, picked)).toEqual(picked)
    expect(choiceFor(free, picked)).toEqual({ themeId: "free", photo: null })
    expect(choiceFor(null, picked)).toEqual({ themeId: null, photo: null })
  })
})
