import { describe, expect, it } from "vitest"
import type { AdminAnnouncement } from "../types"
import {
  announcementBadges,
  counterText,
  countOrDash,
  EDITOR_ABILITIES,
  openedLabel,
  percentOf,
  reachLabel,
  resultStats,
  saveLabel,
  scheduleLabel,
  sendingPoll,
  SENDING_POLL_MS,
  sendTitle,
  stageOf,
  timelineLabel,
  whenLabel,
  withDraftNote,
} from "./announcement"

const announcement = (
  patch: Partial<AdminAnnouncement> = {}
): AdminAnnouncement => ({
  id: "a1",
  title: "Exams are coming",
  message: "Read up.",
  image: null,
  buttons: [],
  status: "sent",
  send_at: null,
  sent_at: "2026-10-01T10:00:00Z",
  push: true,
  important: false,
  banner_until: null,
  audience: {
    campus_ids: [],
    platforms: [],
    min_version: null,
    max_version: null,
    premium: "any",
    joined_within_days: null,
    quiet_for_days: null,
  },
  recipients_count: 200,
  stats: { opened: 50, dismissed: 0, taps: [] },
  created_by: { id: "u1", username: "ada" },
  created_at: "2026-09-30T10:00:00Z",
  updated_at: "2026-09-30T10:00:00Z",
  ...patch,
})

describe("announcementBadges", () => {
  const now = Date.parse("2026-10-05T00:00:00Z")

  it("leads with the status and adds what stands out", () => {
    expect(
      announcementBadges(
        announcement({
          status: "draft",
          important: true,
          push: false,
          banner_until: "2026-10-09T00:00:00Z",
        }),
        now
      ).map((badge) => badge.label)
    ).toEqual(["Draft", "Important", "Feed banner", "No push"])
  })

  it("drops a banner whose time has passed", () => {
    expect(
      announcementBadges(
        announcement({ banner_until: "2026-10-01T00:00:00Z" }),
        now
      ).map((badge) => badge.label)
    ).toEqual(["Sent"])
  })
})

describe("whenLabel and timelineLabel", () => {
  it("names drafts and sending plainly", () => {
    expect(whenLabel(announcement({ status: "draft" }))).toBe("Draft")
    expect(whenLabel(announcement({ status: "sending" }))).toBe("Sending…")
    expect(timelineLabel(announcement({ status: "sending" }))).toBe(
      "Going out now"
    )
  })

  it("says when a scheduled or sent one goes out", () => {
    const scheduled = announcement({
      status: "scheduled",
      send_at: "2026-10-09T09:00:00Z",
    })
    expect(whenLabel(scheduled)).toMatch(/^Scheduled for /)
    expect(timelineLabel(announcement())).toMatch(/^Sent /)
    expect(timelineLabel(announcement({ status: "draft" }))).toMatch(
      /^Started /
    )
  })
})

describe("sendingPoll", () => {
  it("polls only while something is going out", () => {
    expect(sendingPoll(["draft", "sending"])).toBe(SENDING_POLL_MS)
    expect(sendingPoll(["sent", "draft"])).toBe(false)
    expect(sendingPoll([])).toBe(false)
  })
})

describe("stages", () => {
  it("starts new until there is a saved announcement", () => {
    expect(stageOf()).toBe("new")
    expect(stageOf({ status: "scheduled" })).toBe("scheduled")
  })

  it("locks who gets it once it has gone, and everything while it goes", () => {
    expect(EDITOR_ABILITIES.sent).toMatchObject({
      editSetup: false,
      editContent: true,
      send: false,
      remove: true,
    })
    expect(Object.values(EDITOR_ABILITIES.sending).every((on) => !on)).toBe(
      true
    )
    expect(EDITOR_ABILITIES.scheduled.unschedule).toBe(true)
    expect(EDITOR_ABILITIES.new.remove).toBe(false)
  })

  it("words the save and schedule buttons for the stage", () => {
    expect(saveLabel("new")).toBe("Save draft")
    expect(saveLabel("sent")).toBe("Save changes")
    expect(scheduleLabel("draft")).toBe("Schedule")
    expect(scheduleLabel("scheduled")).toBe("Change time")
  })

  it("warns a new one saves itself first", () => {
    expect(withDraftNote("Hint.", "draft", false)).toBe("Hint.")
    expect(withDraftNote("Hint.", "new", true)).toBe(
      "Hint. This saves it as a draft first."
    )
    expect(withDraftNote("Hint.", "new", false)).toMatch(
      /^Hint\. It needs a finished draft first/
    )
  })
})

describe("counts and shares", () => {
  it("counts characters against the limit", () => {
    expect(counterText("Hello", 200)).toBe("5/200")
    expect(counterText("", 2000)).toBe("0/2,000")
  })

  it("words the reach and the send question", () => {
    expect(reachLabel(0)).toBe("Reaches nobody right now")
    expect(reachLabel(1)).toBe("Reaches about 1 person")
    expect(reachLabel(1200)).toBe("Reaches about 1,200 people")
    expect(sendTitle(undefined)).toBe("Send it now?")
    expect(sendTitle(3)).toBe("Send to 3 people now?")
  })

  it("gives a share only when there is something to divide by", () => {
    expect(percentOf(50, 200)).toBe("25%")
    expect(percentOf(5, 0)).toBeNull()
    expect(percentOf(5, null)).toBeNull()
    expect(countOrDash(null)).toBe("—")
    expect(countOrDash(1500)).toBe("1,500")
  })

  it("shows opens only for sent ones", () => {
    expect(openedLabel(announcement())).toBe("50 · 25%")
    expect(openedLabel(announcement({ recipients_count: 0 }))).toBe("50")
    expect(openedLabel(announcement({ status: "draft" }))).toBe("—")
  })
})

describe("resultStats", () => {
  it("lists reach, opens and taps per button", () => {
    const stats = resultStats(
      announcement({
        buttons: [{ label: "Get Premium", url: "https://snacc.fyi/premium" }],
        stats: { opened: 50, dismissed: 0, taps: [7, 2] },
      })
    )

    expect(stats).toEqual([
      { key: "reached", label: "Reached", value: "200" },
      { key: "opened", label: "Opened", value: "50", hint: "25% of reached" },
      { key: "tap-0", label: "Tapped “Get Premium”", value: "7" },
      { key: "tap-1", label: "Tapped “Button 2”", value: "2" },
    ])
  })

  it("adds banner closes when it had a banner", () => {
    const stats = resultStats(
      announcement({
        banner_until: "2026-10-09T00:00:00Z",
        stats: { opened: 0, dismissed: 4, taps: [] },
      })
    )

    expect(stats.at(-1)).toEqual({
      key: "dismissed",
      label: "Dismissed the banner",
      value: "4",
    })
  })
})
