import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { richText } from "./rich-text"

const renderText = (text: string) => render(<p>{richText(text)}</p>)

describe("richText", () => {
  it("links web addresses and mentions, leaving prose alone", () => {
    renderText("hi @bola, see snacc.fyi/about. nice.Also fine")

    expect(
      screen.getByRole("link", { name: "@bola" }).getAttribute("href")
    ).toBe("/@bola")
    expect(
      screen.getByRole("link", { name: "snacc.fyi/about" }).getAttribute("href")
    ).toBe("https://snacc.fyi/about")
    expect(screen.queryByRole("link", { name: /nice/ })).toBeNull()
  })

  it("keeps plain text as it is", () => {
    const { container } = renderText("just words")
    expect(container.textContent).toBe("just words")
  })
})
