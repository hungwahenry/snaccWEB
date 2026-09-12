import { describe, expect, it } from "vitest"
import type { ScheduledSnacc } from "../types"
import {
  goesOutLabel,
  goesOutSentence,
  isTooSoon,
  nextSlot,
  rescheduleSeed,
  scheduledLine,
  scheduledPreview,
  scheduledThumb,
  scheduleWindow,
  tooSoonMessage,
} from "./schedule"

const image = {
  id: "i1",
  url: "full.jpg",
  thumb_url: "thumb.jpg",
  width: 1,
  height: 1,
  position: 0,
}
const gif = {
  giphy_id: "g1",
  url: "gif.gif",
  preview_url: "gif-small.gif",
  width: 1,
  height: 1,
}
const sticker = {
  sticker_id: "k1",
  url: "sticker.webp",
  preview_url: null,
  width: 1,
  height: 1,
}

const at = (day: number, hour: number, minute: number, second = 0) =>
  new Date(2026, 9, day, hour, minute, second)

const item = (over: Partial<ScheduledSnacc> = {}): ScheduledSnacc => ({
  id: "s1",
  body: "hi",
  spoiler: false,
  images: [],
  voice: null,
  gif: null,
  sticker: null,
  poll: null,
  publish_at: at(14, 21, 5).toISOString(),
  status: "pending",
  failure: null,
  created_at: at(13, 20, 0).toISOString(),
  ...over,
})

describe("nextSlot", () => {
  it("goes an hour ahead and rounds up to the next five minutes", () => {
    expect(nextSlot(at(13, 20, 7))).toEqual(at(13, 21, 10))
    expect(nextSlot(at(13, 20, 10))).toEqual(at(13, 21, 10))
    expect(nextSlot(at(13, 20, 10, 1))).toEqual(at(13, 21, 15))
  })

  it("rolls over into the next hour and day", () => {
    expect(nextSlot(at(13, 23, 58))).toEqual(at(14, 1, 0))
  })
})

describe("scheduleWindow", () => {
  it("opens after the lead time and closes on the last whole day", () => {
    const range = scheduleWindow(at(13, 20, 7), 5, 30)
    expect(range.min).toEqual(at(13, 20, 12))
    expect(range.max).toEqual(new Date(2026, 10, 11, 23, 55))
  })
})

describe("isTooSoon", () => {
  it("wants at least the lead time from now", () => {
    const now = at(13, 20, 0)
    expect(isTooSoon(at(13, 19, 0), now, 5)).toBe(true)
    expect(isTooSoon(at(13, 20, 4), now, 5)).toBe(true)
    expect(isTooSoon(at(13, 20, 5), now, 5)).toBe(false)
  })

  it("says how long in minutes", () => {
    expect(tooSoonMessage(5)).toBe("Pick a time at least 5 minutes from now.")
    expect(tooSoonMessage(1)).toBe("Pick a time at least 1 minute from now.")
  })
})

describe("goes out", () => {
  it("writes the day and the time", () => {
    const iso = at(14, 21, 5).toISOString()
    expect(goesOutLabel(iso)).toBe("Wed 14 Oct, 9:05 PM")
    expect(goesOutSentence(iso)).toBe("Wed 14 Oct at 9:05 PM")
  })
})

describe("rescheduleSeed", () => {
  it("keeps a time that is still far enough ahead", () => {
    const now = at(13, 20, 7)
    expect(rescheduleSeed(at(15, 9, 0).toISOString(), now, 5)).toEqual(
      at(15, 9, 0)
    )
    expect(rescheduleSeed(at(15, 9, 2).toISOString(), now, 5)).toEqual(
      at(15, 9, 5)
    )
  })

  it("offers the next slot when the time has come too close or passed", () => {
    const now = at(13, 20, 7)
    expect(rescheduleSeed(at(13, 20, 9).toISOString(), now, 5)).toEqual(
      at(13, 21, 10)
    )
    expect(rescheduleSeed(at(12, 8, 0).toISOString(), now, 5)).toEqual(
      at(13, 21, 10)
    )
  })
})

describe("scheduledPreview", () => {
  it("shows the words when there are any", () => {
    expect(scheduledPreview(item({ body: "  see you there  " }))).toBe(
      "see you there"
    )
  })

  it("names what it carries when it has no words", () => {
    const bare = { body: null }
    const voice = { id: "v1", url: "v.m4a", duration_ms: 1200 }
    const poll = {
      options: [
        { label: "Yes", image: null },
        { label: "No", image: null },
      ],
      duration_minutes: 60,
    }
    expect(scheduledPreview(item({ ...bare, voice }))).toBe("Voice note")
    expect(scheduledPreview(item({ ...bare, poll }))).toBe("Poll")
    expect(scheduledPreview(item({ ...bare, images: [image] }))).toBe("Photo")
    expect(scheduledPreview(item({ ...bare, gif }))).toBe("GIF")
    expect(scheduledPreview(item({ ...bare, sticker }))).toBe("Sticker")
  })
})

describe("scheduledThumb", () => {
  it("shows the first photo, else the GIF, else the sticker", () => {
    expect(scheduledThumb(item({ images: [image], gif }))).toEqual({
      url: "thumb.jpg",
      sticker: false,
    })
    expect(scheduledThumb(item({ gif }))).toEqual({
      url: "gif-small.gif",
      sticker: false,
    })
    expect(scheduledThumb(item({ sticker }))).toEqual({
      url: "sticker.webp",
      sticker: true,
    })
    expect(scheduledThumb(item())).toBeNull()
  })
})

describe("scheduledLine", () => {
  it("says when it goes out", () => {
    expect(scheduledLine(item())).toEqual({
      text: "Goes out Wed 14 Oct, 9:05 PM",
      failed: false,
    })
  })

  it("says why a failed one did not go out", () => {
    expect(
      scheduledLine(item({ status: "failed", failure: "Body too long." }))
    ).toEqual({ text: "Could not go out: Body too long.", failed: true })
    expect(scheduledLine(item({ status: "failed" })).text).toBe(
      "Could not go out."
    )
  })
})
