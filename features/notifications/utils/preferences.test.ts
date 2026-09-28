import { describe, expect, it } from "vitest"
import type { NotificationPreference } from "../types"
import { sectionsOf } from "./preferences"

const preference = (
  category: string,
  section: string,
  section_label: string
): NotificationPreference => ({
  category,
  label: category,
  section,
  section_label,
  push: true,
  email: false,
  emailable: true,
  locked: false,
})

describe("sectionsOf", () => {
  it("keeps the server's order, one heading per run of a section", () => {
    const sections = sectionsOf([
      preference("message", "messages", "Messages"),
      preference("follow", "activity", "Activity"),
      preference("reply", "activity", "Activity"),
      preference("earning", "money", "Money"),
    ])

    expect(sections.map((section) => section.label)).toEqual([
      "Messages",
      "Activity",
      "Money",
    ])
    expect(sections[1].preferences.map((p) => p.category)).toEqual([
      "follow",
      "reply",
    ])
  })

  it("has nothing to show for no switches", () => {
    expect(sectionsOf([])).toEqual([])
  })
})
