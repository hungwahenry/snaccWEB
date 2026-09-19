import { render, screen } from "@testing-library/react"
import { isValidElement } from "react"
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

  it("hands the page nothing but plain values, so a server-rendered page can use it", () => {
    const links = richText("hi @bola, see snacc.fyi/about").filter(
      isValidElement
    )

    expect(links).toHaveLength(2)
    for (const link of links) {
      const props = Object.values(link.props as Record<string, unknown>)
      expect(props.filter((value) => typeof value === "function")).toEqual([])
    }
  })

  it("opens a web address in a new tab, and a mention in this one", () => {
    renderText("see snacc.fyi/about with @bola")

    expect(
      screen
        .getByRole("link", { name: "snacc.fyi/about" })
        .getAttribute("target")
    ).toBe("_blank")
    expect(
      screen.getByRole("link", { name: "@bola" }).getAttribute("target")
    ).toBeNull()
  })
})
