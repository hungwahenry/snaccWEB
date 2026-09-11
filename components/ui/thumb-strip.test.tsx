import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ThumbStrip } from "./thumb-strip"

describe("ThumbStrip", () => {
  it("renders nothing without pictures", () => {
    const { container } = render(<ThumbStrip urls={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("counts what did not fit on the last thumbnail", () => {
    render(<ThumbStrip urls={["a.jpg", "b.jpg"]} extra={3} />)
    expect(screen.getByText("+3")).toBeTruthy()
  })
})
