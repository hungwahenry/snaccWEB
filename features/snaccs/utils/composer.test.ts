import { describe, expect, it } from "vitest"
import { draftRules, type DraftState } from "./composer"

const EMPTY: DraftState = {
  bodyLength: 0,
  bodyMax: 280,
  images: 0,
  maxImages: 4,
  gif: false,
  sticker: false,
  voice: false,
  storedVoice: false,
  recording: false,
  poll: false,
  pollValid: false,
  pollProblem: null,
  hangout: false,
  hangoutValid: false,
  carriesHangout: false,
  voiceAllowed: true,
  stickersAllowed: true,
  clip: false,
  clipsAllowed: true,
  tagProblem: null,
}

describe("draftRules with clips", () => {
  it("offers a clip only while nothing else is attached and clips are on", () => {
    expect(draftRules(EMPTY).canAddClip).toBe(true)
    expect(draftRules({ ...EMPTY, images: 1 }).canAddClip).toBe(false)
    expect(draftRules({ ...EMPTY, poll: true }).canAddClip).toBe(false)
    expect(draftRules({ ...EMPTY, voice: true }).canAddClip).toBe(false)
    expect(draftRules({ ...EMPTY, clipsAllowed: false }).canAddClip).toBe(false)
  })

  it("posts a clip on its own and allows nothing else beside it", () => {
    const rules = draftRules({ ...EMPTY, clip: true })

    expect(rules.withinLimits).toBe(true)
    expect(rules.hasMedia).toBe(true)
    expect(
      [
        rules.canAddClip,
        rules.canAddImages,
        rules.canAddGif,
        rules.canAddSticker,
        rules.canRecordVoice,
        rules.canStartPoll,
      ].some(Boolean)
    ).toBe(false)
  })
})

describe("draftRules with hangouts", () => {
  it("takes words and pictures beside a hangout, and nothing else", () => {
    const rules = draftRules({ ...EMPTY, hangout: true, hangoutValid: true })

    expect(rules.withinLimits).toBe(true)
    expect(rules.canAddImages).toBe(true)
    expect(
      [
        rules.canAddGif,
        rules.canAddSticker,
        rules.canRecordVoice,
        rules.canStartPoll,
        rules.canAddClip,
      ].some(Boolean)
    ).toBe(false)
  })

  it("waits for the plan to be ready before it can post", () => {
    expect(draftRules({ ...EMPTY, hangout: true }).withinLimits).toBe(false)
  })

  it("lets an edit of a hangout's snacc go out with no words", () => {
    const rules = draftRules({ ...EMPTY, carriesHangout: true })
    expect(rules.withinLimits).toBe(true)
    expect(rules.canAddGif).toBe(false)
  })

  it("offers a hangout only while nothing it cannot share with is there", () => {
    expect(draftRules(EMPTY).canStartHangout).toBe(true)
    expect(draftRules({ ...EMPTY, images: 2 }).canStartHangout).toBe(true)
    expect(draftRules({ ...EMPTY, poll: true }).canStartHangout).toBe(false)
    expect(draftRules({ ...EMPTY, gif: true }).canStartHangout).toBe(false)
  })
})
