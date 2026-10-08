import { describe, expect, it } from "vitest"
import { chatThemeMessage } from "./chat-themes"

const theme = { label: "Sunset", enabled: true, premium: true }

describe("chatThemeMessage", () => {
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
