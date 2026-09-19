import { describe, expect, it, vi } from "vitest"
import { driveVideo, isSoundBlocked } from "./playback"

function fakeVideo(play: () => Promise<void> = () => Promise.resolve()) {
  return {
    muted: false,
    paused: true,
    playbackRate: 1,
    play: vi.fn(play),
    pause: vi.fn(),
  }
}

const settled = async () => {
  for (let turn = 0; turn < 5; turn += 1) await Promise.resolve()
}

describe("isSoundBlocked", () => {
  it("knows the browser refusing sound from any other failure", () => {
    expect(isSoundBlocked(new DOMException("no", "NotAllowedError"))).toBe(true)
    expect(isSoundBlocked(new DOMException("gone", "AbortError"))).toBe(false)
    expect(isSoundBlocked(new Error("no"))).toBe(false)
  })
})

describe("driveVideo", () => {
  it("plays at the wanted speed and sound", () => {
    const video = fakeVideo()
    driveVideo(video, { play: true, muted: true, rate: 2 }, vi.fn())

    expect(video.muted).toBe(true)
    expect(video.playbackRate).toBe(2)
    expect(video.play).toHaveBeenCalledTimes(1)
  })

  it("pauses a clip that should not be playing", () => {
    const video = fakeVideo()
    driveVideo(video, { play: false, muted: false, rate: 1 }, vi.fn())

    expect(video.pause).toHaveBeenCalledTimes(1)
    expect(video.play).not.toHaveBeenCalled()
  })

  it("leaves a clip that is already playing alone", () => {
    const video = { ...fakeVideo(), paused: false }
    driveVideo(video, { play: true, muted: false, rate: 1 }, vi.fn())

    expect(video.play).not.toHaveBeenCalled()
  })

  it("says so when the browser will not play with sound", async () => {
    const blocked = vi.fn()
    const refuse = () =>
      Promise.reject(new DOMException("no", "NotAllowedError"))

    driveVideo(
      fakeVideo(refuse),
      { play: true, muted: false, rate: 1 },
      blocked
    )
    await settled()
    expect(blocked).toHaveBeenCalledTimes(1)

    blocked.mockClear()
    driveVideo(fakeVideo(refuse), { play: true, muted: true, rate: 1 }, blocked)
    await settled()
    expect(blocked).not.toHaveBeenCalled()
  })
})
