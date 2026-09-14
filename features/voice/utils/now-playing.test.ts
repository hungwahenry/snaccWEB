import { describe, expect, it } from "vitest"
import { hidesNowPlaying, nowPlayingTime, voiceSourcePath } from "./now-playing"

describe("hidesNowPlaying", () => {
  it("hides on the full-screen pages", () => {
    expect(hidesNowPlaying("/compose")).toBe(true)
    expect(hidesNowPlaying("/moments/u1")).toBe(true)
    expect(hidesNowPlaying("/moments/new")).toBe(true)
  })

  it("shows everywhere else", () => {
    for (const path of [
      "/home",
      "/snacc/s1",
      "/messages",
      "/messages/c1",
      "/chat/r1",
      "/profile/ada",
      "/settings",
    ]) {
      expect(hidesNowPlaying(path)).toBe(false)
    }
  })
})

describe("nowPlayingTime", () => {
  it("reads where the note is, then its length", () => {
    expect(nowPlayingTime(12_000, 45_000)).toBe("0:12 / 0:45")
    expect(nowPlayingTime(0, 75_000)).toBe("0:00 / 1:15")
  })

  it("never runs past the end", () => {
    expect(nowPlayingTime(46_000, 45_000)).toBe("0:45 / 0:45")
  })
})

describe("voiceSourcePath", () => {
  it("opens the snacc, the conversation or the room", () => {
    expect(voiceSourcePath({ kind: "snacc", id: "s1" })).toBe("/snacc/s1")
    expect(voiceSourcePath({ kind: "conversation", id: "c1" })).toBe(
      "/messages/c1"
    )
    expect(voiceSourcePath({ kind: "chat", id: "r1" })).toBe("/chat/r1")
  })
})
