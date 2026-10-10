import { describe, expect, it } from "vitest"
import type { AdminChatTheme } from "../types"
import {
  chatThemeMessage,
  deleteWarning,
  draftFrom,
  draftProblem,
  hexOf,
  isColor,
  kindNote,
  paintOfDraft,
  toCreateInput,
  toUpdateInput,
  washOf,
  washParts,
  withKind,
  withoutStop,
  withStop,
  withStopColor,
} from "./chat-themes"

const lagoon: AdminChatTheme = {
  id: "t1",
  key: "lagoon",
  label: "Lagoon",
  kind: "preset",
  position: 0,
  enabled: true,
  premium: false,
  in_use: { chats: 3, all_chats: 0 },
  image_url: null,
  updated_at: "2026-10-09T00:00:00.000Z",
  look: {
    light: {
      background: {
        kind: "gradient",
        colors: ["#E0F7F4", "#CDEBFA"],
        angle: 160,
      },
      wash: null,
      mine: { fill: "#0D8478", text: "#FFFFFF" },
      theirs: { fill: "#FFFFFF", text: "#0F2E36" },
      meta: "#4B6B73",
    },
    dark: {
      background: { kind: "solid", color: "#05242B" },
      wash: null,
      mine: { fill: "#0D8478", text: "#FFFFFF" },
      theirs: { fill: "#16343D", text: "#E3F4F2" },
      meta: "#8FB3B8",
    },
  },
}

describe("colours", () => {
  it("takes what both apps can read and nothing else", () => {
    expect(isColor("#fff")).toBe(true)
    expect(isColor(" #0D8478 ")).toBe(true)
    expect(isColor("rgba(0, 0, 0, 0.38)")).toBe(true)
    expect(isColor("#0D847880")).toBe(false)
    expect(isColor("rgba(256, 0, 0, 1)")).toBe(false)
    expect(isColor("teal")).toBe(false)
  })

  it("hands the colour picker a six-digit hex", () => {
    expect(hexOf("#ABC")).toBe("#aabbcc")
    expect(hexOf("#0D8478")).toBe("#0d8478")
    expect(hexOf("rgba(17, 17, 17, 0.86)")).toBe("#111111")
    expect(hexOf("nope")).toBe("#000000")
  })
})

describe("drafts", () => {
  it("round-trips a saved theme through the form unchanged", () => {
    const draft = draftFrom(lagoon)
    expect(toUpdateInput(draft)).toEqual({
      label: "Lagoon",
      look: lagoon.look,
      position: 0,
    })
  })

  it("starts a new theme from a look that already works", () => {
    const draft = draftFrom()
    expect(draft).toMatchObject({
      key: "",
      label: "",
      kind: "preset",
      position: "",
    })
    expect(draftProblem({ ...draft, key: "berry", label: "Berry" })).toBeNull()
    expect(
      toCreateInput({ ...draft, key: " berry ", label: " Berry " })
    ).toMatchObject({ key: "berry", label: "Berry", kind: "preset" })
    expect(
      "position" in toCreateInput({ ...draft, key: "a1", label: "A" })
    ).toBe(false)
  })

  it("leaves a photo theme's background to the photo", () => {
    const draft = { ...draftFrom(lagoon), kind: "photo" as const }
    expect(paintOfDraft(draft.light, "photo").background).toBeNull()
    expect(toCreateInput(draft).look.dark.background).toBeNull()
  })

  it("needs a picture behind an image theme, new or already saved", () => {
    const draft = withKind(draftFrom(lagoon), "image")
    expect(draftProblem(draft)).toBe("Choose the picture that sits behind it.")
    expect(
      draftProblem({ ...draft, picture: new File(["x"], "rain.png") })
    ).toBeNull()
    expect(
      draftProblem({ ...draft, pictureUrl: "https://cdn/rain.jpg" })
    ).toBeNull()
    expect(paintOfDraft(draft.dark, "image").background).toBeNull()
    expect(
      draftFrom({ ...lagoon, kind: "image", image_url: "https://cdn/rain.jpg" })
    ).toMatchObject({ picture: null, pictureUrl: "https://cdn/rain.jpg" })
  })

  it("says what to fix first", () => {
    const draft = { ...draftFrom(lagoon) }
    expect(draftProblem({ ...draft, key: "Bad Key" })).toBe(
      "The key needs 2 to 40 lowercase letters, numbers or underscores."
    )
    expect(draftProblem({ ...draft, label: " " })).toBe(
      "Give it a name of up to 40 characters."
    )
    expect(draftProblem({ ...draft, position: "-1" })).toBe(
      "Position must be a whole number, 0 or more."
    )
    expect(
      draftProblem({ ...draft, dark: { ...draft.dark, mineText: "white" } })
    ).toBe("Dark mode: your bubble's text isn't a colour.")
    expect(
      draftProblem({ ...draft, light: { ...draft.light, angle: "400" } })
    ).toBe("Light mode: the gradient angle must be 0 to 360.")
    const photo = withKind(draft, "photo")
    expect(
      draftProblem({
        ...photo,
        light: { ...photo.light, stops: ["nope", "nope"] },
      })
    ).toBeNull()
  })

  it("gives a picture theme a see-through wash in both modes", () => {
    const image = withKind(draftFrom(lagoon), "image")
    expect(image.light.wash).toBe("rgba(255, 255, 255, 0.45)")
    expect(image.dark.wash).toBe("rgba(0, 0, 0, 0.45)")

    const kept = withKind(
      {
        ...draftFrom(lagoon),
        dark: { ...draftFrom(lagoon).dark, wash: "rgba(1, 2, 3, 0.2)" },
      },
      "photo"
    )
    expect(kept.dark.wash).toBe("rgba(1, 2, 3, 0.2)")

    const pictured = { ...image, pictureUrl: "https://cdn/rain.jpg" }
    expect(
      draftProblem({ ...pictured, dark: { ...pictured.dark, wash: "" } })
    ).toBe(
      "Dark mode: the wash is needed over a picture so the chat stays readable."
    )
    expect(
      draftProblem({
        ...pictured,
        light: { ...pictured.light, wash: "#adadad" },
      })
    ).toBe("Light mode: the wash must be see-through over a picture.")
    expect(draftProblem(pictured)).toBeNull()
  })

  it("keeps a gradient to two to four colours", () => {
    const paint = draftFrom(lagoon).light
    const four = withStop(withStop(paint))
    expect(four.stops).toEqual(["#E0F7F4", "#CDEBFA", "#CDEBFA", "#CDEBFA"])
    expect(withStop(four)).toBe(four)
    expect(withoutStop(paint, 0)).toBe(paint)
    expect(withoutStop(four, 1).stops).toHaveLength(3)
    expect(withStopColor(paint, 1, "#111").stops).toEqual(["#E0F7F4", "#111"])
  })
})

describe("washes", () => {
  it("splits a wash into a colour and a strength and back", () => {
    expect(washParts("rgba(0, 0, 0, 0.45)")).toEqual({
      color: "#000000",
      opacity: 45,
    })
    expect(washParts("#adadad")).toEqual({ color: "#adadad", opacity: 100 })
    expect(washOf("#FF8000", 30)).toBe("rgba(255, 128, 0, 0.3)")
    expect(washOf("#000", 100)).toBe("rgba(0, 0, 0, 0.95)")
  })
})

describe("kindNote", () => {
  it("tells the kinds apart in the table", () => {
    expect(kindNote({ kind: "preset", image_url: null })).toBe("")
    expect(kindNote({ kind: "photo", image_url: null })).toBe(
      " · each person's photo"
    )
    expect(kindNote({ kind: "image", image_url: null })).toBe(
      " · no picture yet"
    )
    expect(kindNote({ kind: "image", image_url: "https://cdn/x.jpg" })).toBe(
      " · picture"
    )
  })
})

describe("deleteWarning", () => {
  it("says who loses the look, and the photos when it is a photo theme", () => {
    const none = { chats: 0, all_chats: 0 }
    expect(deleteWarning({ in_use: none, kind: "preset" })).toBe(
      "Nobody is using it, so no chat changes."
    )
    expect(
      deleteWarning({ in_use: { chats: 1, all_chats: 0 }, kind: "preset" })
    ).toBe(
      "In use: 1 chat. Everyone using it goes back to the default look straight away."
    )
    expect(
      deleteWarning({ in_use: { chats: 3, all_chats: 2 }, kind: "photo" })
    ).toBe(
      "In use: 3 chats · 2 people for all chats. Everyone using it goes back to the default look straight away. The photos people put behind it are deleted too."
    )
    expect(
      deleteWarning({ in_use: { chats: 0, all_chats: 1 }, kind: "preset" })
    ).toBe(
      "In use: 1 person for all chats. Everyone using it goes back to the default look straight away."
    )
  })
})

describe("chatThemeMessage", () => {
  const theme = { label: "Sunset", enabled: true, premium: true }

  it("says what the switch just did", () => {
    expect(chatThemeMessage(theme, { premium: true })).toBe(
      "Sunset now needs Premium."
    )
    expect(
      chatThemeMessage({ ...theme, premium: false }, { premium: false })
    ).toBe("Sunset is free for everyone.")
    expect(chatThemeMessage(theme, { enabled: true })).toBe(
      "Sunset is offered in the picker."
    )
    expect(
      chatThemeMessage({ ...theme, enabled: false }, { enabled: false })
    ).toBe("Sunset is no longer offered.")
  })
})
