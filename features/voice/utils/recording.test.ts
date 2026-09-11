import { describe, expect, it } from "vitest"
import {
  CANCEL_DISTANCE,
  cancelProgress,
  micErrorMessage,
  pickMimeType,
  slideCancels,
  voiceFileName,
} from "./recording"

describe("pickMimeType", () => {
  it("prefers webm with opus", () => {
    expect(pickMimeType(() => true)).toBe("audio/webm;codecs=opus")
  })

  it("falls back to what the browser supports (Safari records mp4)", () => {
    expect(pickMimeType((type) => type === "audio/mp4")).toBe("audio/mp4")
  })

  it("is undefined when nothing is supported", () => {
    expect(pickMimeType(() => false)).toBeUndefined()
  })
})

describe("voiceFileName", () => {
  it("names the file after the recorded format", () => {
    expect(voiceFileName("audio/mp4")).toBe("voice.m4a")
    expect(voiceFileName("audio/ogg")).toBe("voice.ogg")
    expect(voiceFileName("audio/mpeg")).toBe("voice.mp3")
    expect(voiceFileName("audio/webm")).toBe("voice.webm")
    expect(voiceFileName("")).toBe("voice.webm")
  })
})

describe("micErrorMessage", () => {
  it("points to browser settings when access was refused", () => {
    expect(micErrorMessage(new DOMException("no", "NotAllowedError"))).toBe(
      "Microphone access is off. Allow it in your browser settings."
    )
    expect(micErrorMessage(new DOMException("no", "SecurityError"))).toBe(
      "Microphone access is off. Allow it in your browser settings."
    )
  })

  it("asks for the mic on any other failure", () => {
    expect(micErrorMessage(new DOMException("none", "NotFoundError"))).toBe(
      "Snacc needs your microphone to record."
    )
    expect(micErrorMessage(new Error("boom"))).toBe(
      "Snacc needs your microphone to record."
    )
  })
})

describe("slide to cancel", () => {
  it("arms gradually as the finger slides left", () => {
    expect(cancelProgress(0)).toBe(0)
    expect(cancelProgress(-CANCEL_DISTANCE / 2)).toBe(0.5)
    expect(cancelProgress(-CANCEL_DISTANCE * 2)).toBe(1)
  })

  it("cancels only once the slide reaches the distance", () => {
    expect(slideCancels(-CANCEL_DISTANCE + 1)).toBe(false)
    expect(slideCancels(-CANCEL_DISTANCE)).toBe(true)
  })
})
