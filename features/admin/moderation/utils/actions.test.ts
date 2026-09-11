import { describe, expect, it } from "vitest"
import {
  ACTION_HINTS,
  ACTION_OPTIONS,
  ACTION_STATUS,
  MODERATION_ACTIONS,
  VERDICT_OPTIONS,
} from "./actions"

describe("moderation actions", () => {
  it("shows each action by its own name, louder as it gets harsher", () => {
    expect(MODERATION_ACTIONS.map((action) => ACTION_STATUS[action])).toEqual([
      { label: "allow", variant: "outline" },
      { label: "flag", variant: "secondary" },
      { label: "hold", variant: "default" },
      { label: "block", variant: "destructive" },
    ])
  })

  it("offers every action in the rule dialog, mildest first, each explained", () => {
    expect(ACTION_OPTIONS).toEqual([
      { value: "allow", label: "Allow" },
      { value: "flag", label: "Flag" },
      { value: "hold", label: "Hold" },
      { value: "block", label: "Block" },
    ])
    for (const action of MODERATION_ACTIONS) {
      expect(ACTION_HINTS[action]).not.toBe("")
    }
  })

  it("filters reviews by any verdict, flag first", () => {
    expect(VERDICT_OPTIONS.map((option) => option.label)).toEqual([
      "Flag",
      "Hold",
      "Block",
      "Allow",
    ])
  })
})
