import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { LightboxViewer } from "./lightbox-viewer"

const images = [
  { url: "a.jpg", width: 10, height: 10 },
  { url: "b.jpg" },
  { url: "c.jpg" },
]

function setup(
  index = 0,
  extra: Partial<Parameters<typeof LightboxViewer>[0]> = {}
) {
  const props = {
    images,
    index,
    onIndex: vi.fn(),
    onClose: vi.fn(),
    saving: false,
    onSave: vi.fn(),
    ...extra,
  }
  render(<LightboxViewer {...props} />)
  return props
}

describe("LightboxViewer", () => {
  it("shows where you are and moves both ways, wrapping around", () => {
    const props = setup(0)
    expect(screen.getByText("1 / 3")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Previous image" }))
    expect(props.onIndex).toHaveBeenLastCalledWith(2)
    fireEvent.keyDown(window, { key: "ArrowRight" })
    expect(props.onIndex).toHaveBeenLastCalledWith(1)
  })

  it("saves the picture on screen and offers a sticker only with a size", () => {
    const onMakeSticker = vi.fn()
    const props = setup(0, { onMakeSticker })
    fireEvent.click(screen.getByRole("button", { name: "Save image" }))
    expect(props.onSave).toHaveBeenCalledWith(images[0])
    fireEvent.click(screen.getByRole("button", { name: "Make a sticker" }))
    expect(onMakeSticker).toHaveBeenCalledWith(images[0])
  })

  it("hides sticker making for a picture of unknown size", () => {
    setup(1, { onMakeSticker: vi.fn() })
    expect(screen.queryByRole("button", { name: "Make a sticker" })).toBeNull()
  })

  it("shows a spinner instead of the save button while saving", () => {
    setup(0, { saving: true })
    expect(screen.queryByRole("button", { name: "Save image" })).toBeNull()
    expect(screen.getByRole("status", { name: "Saving image" })).toBeTruthy()
  })
})
