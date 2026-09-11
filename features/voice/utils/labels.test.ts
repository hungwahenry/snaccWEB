import { describe, expect, it } from "vitest"
import {
  playButtonLabel,
  positionLabel,
  speedLabel,
  voiceNoteLabel,
} from "./labels"

describe("playButtonLabel", () => {
  it("says what the button will do", () => {
    expect(playButtonLabel({ loading: false, playing: false })).toBe(
      "Play voice note"
    )
    expect(playButtonLabel({ loading: false, playing: true })).toBe(
      "Pause voice note"
    )
    expect(playButtonLabel({ loading: true, playing: true })).toBe(
      "Loading voice note"
    )
  })
})

describe("labels", () => {
  it("reads the speed", () => {
    expect(speedLabel(1.5)).toBe("Playback speed 1.5x. Change speed")
  })

  it("reads the position against the length", () => {
    expect(positionLabel(5_000, 12_000)).toBe("0:05 of 0:12")
  })

  it("names the note with its length", () => {
    expect(voiceNoteLabel(72_000)).toBe("Voice note, 1:12")
  })
})
