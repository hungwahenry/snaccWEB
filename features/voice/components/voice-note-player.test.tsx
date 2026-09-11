import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { VoiceNotePlayer } from "./voice-note-player"

vi.mock("@/lib/feedback", () => ({ showErrorMessage: vi.fn() }))

const created: HTMLAudioElement[] = []

beforeEach(() => {
  created.length = 0
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  const RealAudio = window.Audio
  vi.stubGlobal("Audio", function (url?: string) {
    const element = new RealAudio(url)
    created.push(element)
    return element
  })
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined)
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const note = (id: string) => ({
  id,
  url: `https://media.test/${id}.webm`,
  duration_ms: 12_000,
})

describe("VoiceNotePlayer", () => {
  it("shows the length and a play button before it is played", () => {
    render(<VoiceNotePlayer note={note("a")} />)

    expect(screen.getByRole("group", { name: "Voice note, 0:12" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Play voice note" })).toBeTruthy()
    expect(screen.getByText("0:12")).toBeTruthy()
    expect(created).toHaveLength(0)
  })

  it("loads on tap, then offers pause, speed and seeking once playing", () => {
    render(<VoiceNotePlayer note={note("a")} />)

    fireEvent.click(screen.getByRole("button", { name: "Play voice note" }))
    expect(
      screen.getByRole("button", { name: "Loading voice note" })
    ).toBeTruthy()
    expect(created).toHaveLength(1)

    act(() => {
      created[0].dispatchEvent(new Event("playing"))
    })

    expect(
      screen.getByRole("button", { name: "Pause voice note" })
    ).toBeTruthy()
    expect(
      screen.getByRole("button", { name: /Playback speed 1x/ })
    ).toBeTruthy()
    expect(screen.getByRole("slider", { name: "Seek" })).toBeTruthy()
  })

  it("goes back to its idle look when the note ends", () => {
    render(<VoiceNotePlayer note={note("a")} />)

    fireEvent.click(screen.getByRole("button", { name: "Play voice note" }))
    act(() => {
      created[0].dispatchEvent(new Event("playing"))
      created[0].dispatchEvent(new Event("ended"))
    })

    expect(screen.getByRole("button", { name: "Play voice note" })).toBeTruthy()
  })

  it("pauses the first note when a second one starts", () => {
    render(
      <>
        <VoiceNotePlayer note={note("a")} />
        <VoiceNotePlayer note={note("b")} />
      </>
    )

    const [first, second] = screen.getAllByRole("button", {
      name: "Play voice note",
    })
    fireEvent.click(first)
    act(() => {
      created[0].dispatchEvent(new Event("playing"))
    })
    fireEvent.click(second)
    act(() => {
      created[1].dispatchEvent(new Event("playing"))
    })

    const buttons = screen.getAllByRole("button", { name: /voice note/ })
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Play voice note",
      "Pause voice note",
    ])
  })

  it("seeks from the keyboard", () => {
    render(<VoiceNotePlayer note={note("a")} />)

    fireEvent.click(screen.getByRole("button", { name: "Play voice note" }))
    act(() => {
      created[0].dispatchEvent(new Event("playing"))
    })

    const slider = screen.getByRole("slider", { name: "Seek" })
    fireEvent.keyDown(slider, { key: "End" })

    expect(created[0].currentTime).toBe(12)
    expect(slider.getAttribute("aria-valuenow")).toBe("100")
  })
})
