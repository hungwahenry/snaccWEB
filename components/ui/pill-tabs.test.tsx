import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PillTabs } from "./pill-tabs"

const tabs = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
] as const

describe("PillTabs", () => {
  it("marks the chosen tab and changes on click", () => {
    const onChange = vi.fn()
    render(<PillTabs tabs={[...tabs]} value="a" onChange={onChange} />)

    expect(
      screen.getByRole("tab", { name: "Alpha" }).getAttribute("aria-selected")
    ).toBe("true")
    fireEvent.click(screen.getByRole("tab", { name: "Beta" }))
    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("moves with the arrow keys and wraps around", () => {
    const onChange = vi.fn()
    render(<PillTabs tabs={[...tabs]} value="a" onChange={onChange} />)

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowLeft" })
    expect(onChange).toHaveBeenLastCalledWith("c")
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" })
    expect(onChange).toHaveBeenLastCalledWith("b")
  })

  it("offers the reselect menu on the tab already chosen", () => {
    const onReselect = vi.fn()
    render(
      <PillTabs
        tabs={[...tabs]}
        value="a"
        onChange={vi.fn()}
        onReselect={onReselect}
      />
    )
    fireEvent.click(screen.getByRole("tab", { name: "Alpha" }))
    expect(onReselect).toHaveBeenCalledWith("a", expect.any(HTMLElement))
  })
})
