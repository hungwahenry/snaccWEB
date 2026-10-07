import { describe, expect, it } from "vitest"
import type { AdminAnnouncement, AnnouncementDraft } from "../types"
import {
  draftFrom,
  hasChanges,
  isButtonReady,
  isDraftReady,
  patchButton,
  toCreateInput,
  toUpdateInput,
  withButton,
  withoutButton,
} from "./draft"

const saved = (patch: Partial<AdminAnnouncement> = {}): AdminAnnouncement => ({
  id: "a1",
  title: "Exams are coming",
  message: "Read up.",
  image: null,
  buttons: [
    { label: "Get Premium", url: "https://snacc.fyi/premium" },
    { label: "Read more", url: "https://example.com/exams" },
  ],
  status: "draft",
  send_at: null,
  sent_at: null,
  push: false,
  important: false,
  banner_until: "2026-10-09T00:00:00.000Z",
  audience: {
    campus_ids: ["c1"],
    platforms: ["android"],
    min_version: "1.4.0",
    max_version: null,
    premium: "premium",
    joined_within_days: null,
    quiet_for_days: 14,
  },
  recipients_count: null,
  stats: { opened: 0, dismissed: 0, taps: [] },
  created_by: null,
  created_at: "2026-09-30T10:00:00Z",
  updated_at: "2026-09-30T10:00:00Z",
  ...patch,
})

const ready = (patch: Partial<AnnouncementDraft> = {}): AnnouncementDraft => ({
  ...draftFrom(),
  title: "Hi",
  message: "Yo",
  ...patch,
})

describe("draftFrom", () => {
  it("starts empty, with a push and no buttons", () => {
    expect(draftFrom()).toMatchObject({
      title: "",
      message: "",
      buttons: [],
      bannerUntil: null,
      push: true,
    })
  })

  it("reads presets and other links back out of the buttons", () => {
    expect(draftFrom(saved()).buttons).toEqual([
      { label: "Get Premium", link: "premium", url: "" },
      { label: "Read more", link: "other", url: "https://example.com/exams" },
    ])
  })
})

describe("buttons", () => {
  it("adds up to two empty buttons", () => {
    const one = withButton([])
    expect(one).toEqual([{ label: "", link: null, url: "" }])
    const two = withButton(one)
    expect(withButton(two)).toBe(two)
  })

  it("edits and removes one button by position", () => {
    const buttons = withButton(withButton([]))
    expect(patchButton(buttons, 1, { label: "Go" })[1].label).toBe("Go")
    expect(patchButton(buttons, 1, { label: "Go" })[0].label).toBe("")
    expect(withoutButton(buttons, 0)).toHaveLength(1)
  })

  it("needs a label and somewhere to go", () => {
    expect(isButtonReady({ label: "Go", link: "wallet", url: "" })).toBe(true)
    expect(isButtonReady({ label: " ", link: "wallet", url: "" })).toBe(false)
    expect(isButtonReady({ label: "Go", link: null, url: "" })).toBe(false)
    expect(
      isButtonReady({ label: "Go", link: "other", url: "http://x.com" })
    ).toBe(false)
    expect(
      isButtonReady({ label: "Go", link: "other", url: "https://x.com" })
    ).toBe(true)
  })
})

describe("isDraftReady", () => {
  it("needs a title, a message, finished buttons and a sound audience", () => {
    expect(isDraftReady(ready())).toBe(true)
    expect(isDraftReady(ready({ title: " " }))).toBe(false)
    expect(isDraftReady(ready({ message: "" }))).toBe(false)
    expect(isDraftReady(ready({ message: "x".repeat(2001) }))).toBe(false)
    expect(isDraftReady(ready({ buttons: withButton([]) }))).toBe(false)
    expect(
      isDraftReady(
        ready({ audience: { ...draftFrom().audience, minVersion: "abc" } })
      )
    ).toBe(false)
  })
})

describe("toCreateInput", () => {
  it("trims and turns every choice into what the API takes", () => {
    expect(
      toCreateInput({
        ...draftFrom(saved()),
        title: " Exams ",
        message: " Read up. ",
      })
    ).toEqual({
      title: "Exams",
      message: "Read up.",
      buttons: [
        { label: "Get Premium", url: "https://snacc.fyi/premium" },
        { label: "Read more", url: "https://example.com/exams" },
      ],
      bannerUntil: "2026-10-09T00:00:00.000Z",
      push: false,
      audience: {
        campusIds: ["c1"],
        platforms: ["android"],
        minVersion: "1.4.0",
        maxVersion: null,
        premium: "premium",
        joinedWithinDays: null,
        quietForDays: 14,
      },
    })
  })
})

describe("toUpdateInput", () => {
  it("only sends the wording, buttons and banner once it has gone", () => {
    const draft = draftFrom(saved())

    expect(Object.keys(toUpdateInput(draft, "sent")).sort()).toEqual([
      "bannerUntil",
      "buttons",
      "message",
      "title",
    ])
    expect(toUpdateInput(draft, "scheduled")).toHaveProperty("audience")
    expect(toUpdateInput(draft, "draft")).toHaveProperty("push", false)
  })
})

describe("hasChanges", () => {
  it("ignores stray spaces and notices real edits", () => {
    const announcement = saved()
    const draft = draftFrom(announcement)

    expect(hasChanges(draft, announcement)).toBe(false)
    expect(
      hasChanges({ ...draft, title: " Exams are coming " }, announcement)
    ).toBe(false)
    expect(hasChanges({ ...draft, push: true }, announcement)).toBe(true)
  })

  it("ignores who it is for once it has gone", () => {
    const announcement = saved({ status: "sent" })
    const draft = draftFrom(announcement)

    expect(
      hasChanges(
        { ...draft, audience: { ...draft.audience, premium: "free" } },
        announcement
      )
    ).toBe(false)
    expect(hasChanges({ ...draft, bannerUntil: null }, announcement)).toBe(true)
  })
})
