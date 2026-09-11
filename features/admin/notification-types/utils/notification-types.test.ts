import { describe, expect, it } from "vitest"
import type { NotificationTypeRow } from "../types"
import {
  draftFrom,
  filterTypes,
  groupingText,
  isDraftReady,
  toPatch,
} from "./notification-types"

const row = (
  patch: Partial<NotificationTypeRow> = {}
): NotificationTypeRow => ({
  key: "follow",
  label: "New follower",
  body_template: "{actor} followed you",
  detail_template: null,
  icon_name: "user-plus",
  target_kind: "user",
  default_push: true,
  default_email: false,
  instant_email: false,
  aggregates: false,
  group_window_minutes: null,
  locked: false,
  emailable: true,
  push_debounce_seconds: null,
  position: 1,
  ...patch,
})

describe("filterTypes", () => {
  const rows = [row(), row({ key: "tip", label: "Tip", body_template: "paid" })]

  it("keeps everything for an empty search", () => {
    expect(filterTypes(rows, "  ")).toHaveLength(2)
  })

  it("matches key, label or wording, ignoring case", () => {
    expect(filterTypes(rows, "FOLLOW").map((r) => r.key)).toEqual(["follow"])
    expect(filterTypes(rows, "paid").map((r) => r.key)).toEqual(["tip"])
  })
})

describe("groupingText", () => {
  it("describes how repeats fold", () => {
    expect(groupingText(row())).toBe("one per event")
    expect(groupingText(row({ aggregates: true }))).toBe("folds indefinitely")
    expect(
      groupingText(row({ aggregates: true, group_window_minutes: 1440 }))
    ).toBe("folds for a day")
  })
})

describe("drafts", () => {
  it("sends a blank window as no window", () => {
    const draft = draftFrom(row())
    expect(draft.window).toBe("")
    expect(toPatch(draft)).toMatchObject({
      label: "New follower",
      bodyTemplate: "{actor} followed you",
      detailTemplate: "",
      groupWindowMinutes: 0,
    })
  })

  it("refuses a window that is not a whole number", () => {
    const draft = { ...draftFrom(row()), window: "ten" }
    expect(isDraftReady(draft)).toBe(false)
    expect(isDraftReady({ ...draft, window: "60" })).toBe(true)
    expect(toPatch({ ...draft, window: "60" }).groupWindowMinutes).toBe(60)
  })
})
