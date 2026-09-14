import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { VoiceNoteHost } from "../containers/voice-note-host"
import { currentVoicePlayback, voicePlayer } from "../hooks/use-voice-player"
import type { VoiceSource } from "../types"
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

const source = (id: string): VoiceSource => ({
  kind: "snacc",
  id,
  label: "@ada",
  avatarUrl: null,
  authorId: "u1",
})

function renderPlayers(...ids: string[]) {
  return render(
    <>
      <VoiceNoteHost />
      {ids.map((id) => (
        <VoiceNotePlayer key={id} note={note(id)} source={source(id)} />
      ))}
    </>
  )
}

const audio = () => created[0]

function playFirst() {
  fireEvent.click(screen.getAllByRole("button", { name: "Play voice note" })[0])
  act(() => {
    audio().dispatchEvent(new Event("playing"))
  })
}

describe("VoiceNotePlayer", () => {
  it("shows the length and a play button before it is played", () => {
    renderPlayers("a")

    expect(screen.getByRole("group", { name: "Voice note, 0:12" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Play voice note" })).toBeTruthy()
    expect(screen.getByText("0:12")).toBeTruthy()
    expect(created).toHaveLength(1)
    expect(audio().getAttribute("src")).toBeNull()
  })

  it("loads on tap, then offers pause, speed and seeking once playing", () => {
    renderPlayers("a")

    fireEvent.click(screen.getByRole("button", { name: "Play voice note" }))
    expect(
      screen.getByRole("button", { name: "Loading voice note" })
    ).toBeTruthy()
    expect(audio().getAttribute("src")).toBe(note("a").url)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce()

    act(() => {
      audio().dispatchEvent(new Event("playing"))
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
    renderPlayers("a")

    playFirst()
    act(() => {
      audio().dispatchEvent(new Event("ended"))
    })

    expect(screen.getByRole("button", { name: "Play voice note" })).toBeTruthy()
    expect(currentVoicePlayback()).toBeNull()
  })

  it("plays one note at a time through the same element", () => {
    renderPlayers("a", "b")

    playFirst()
    fireEvent.click(
      screen.getAllByRole("button", { name: "Play voice note" })[0]
    )
    act(() => {
      audio().dispatchEvent(new Event("playing"))
    })

    const buttons = screen.getAllByRole("button", { name: /voice note/ })
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Play voice note",
      "Pause voice note",
    ])
    expect(created).toHaveLength(1)
    expect(audio().getAttribute("src")).toBe(note("b").url)
  })

  it("seeks from the keyboard", () => {
    renderPlayers("a")

    playFirst()
    const slider = screen.getByRole("slider", { name: "Seek" })
    fireEvent.keyDown(slider, { key: "End" })

    expect(audio().currentTime).toBe(12)
    expect(slider.getAttribute("aria-valuenow")).toBe("100")
  })

  it("keeps playing when its row goes away", () => {
    const view = renderPlayers("a")

    playFirst()
    view.rerender(<VoiceNoteHost />)

    expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled()
    expect(currentVoicePlayback()?.status).toBe("playing")
  })

  it("stops when its snacc goes", () => {
    renderPlayers("a")

    playFirst()
    act(() => voicePlayer.stopIfFrom({ snaccId: "a" }))

    expect(screen.getByRole("button", { name: "Play voice note" })).toBeTruthy()
    expect(audio().getAttribute("src")).toBeNull()
  })

  it("stops a take that isn't posted yet when its row goes away", () => {
    const view = render(
      <>
        <VoiceNoteHost />
        <VoiceNotePlayer note={note("draft")} source={null} />
      </>
    )

    playFirst()
    view.rerender(<VoiceNoteHost />)

    expect(currentVoicePlayback()).toBeNull()
  })
})
