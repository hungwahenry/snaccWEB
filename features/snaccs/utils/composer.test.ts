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
