import { describe, expect, it } from "vitest"
import type { SnaccClip } from "@/features/snaccs/types"
import type { ClipDraft } from "../types"
import {
  clipContentType,
  clipProblem,
  clipStatusLabel,
  progressStep,
  withLocalPreview,
} from "./clips"

const LIMITS = { maxSeconds: 60, maxMb: 100 }
const processing: SnaccClip = {
  id: "c1",
  status: "processing",
  url: null,
  poster_url: null,
  width: 720,
  height: 1280,
  duration_ms: 4000,
}
const local = { url: "blob:clip" } as ClipDraft

describe("clipContentType", () => {
  it("takes MP4 and MOV and nothing else", () => {
    expect(clipContentType("video/mp4")).toBe("video/mp4")
    expect(clipContentType("video/quicktime")).toBe("video/quicktime")
    expect(clipContentType("video/webm")).toBeNull()
  })
})

describe("clipProblem", () => {
  it("is fine within the limits", () => {
    expect(
      clipProblem(
        { type: "video/mp4", sizeBytes: 5_000_000, durationMs: 60_200 },
        LIMITS
      )
    ).toBeNull()
  })

  it("says what is wrong otherwise", () => {
    expect(
      clipProblem({ type: "video/webm", sizeBytes: 1, durationMs: 1 }, LIMITS)
    ).toBe("Pick an MP4 or MOV video.")
    expect(
      clipProblem(
        { type: "video/mp4", sizeBytes: 1, durationMs: 90_000 },
        LIMITS
      )
    ).toBe("Clips can be up to 60 seconds. Trim it and try again.")
    expect(
      clipProblem(
        { type: "video/mp4", sizeBytes: 200 * 1024 * 1024, durationMs: 1 },
        LIMITS
      )
    ).toBe("That video is over 100 MB. Pick a smaller one.")
  })
})

describe("withLocalPreview", () => {
  it("plays the file you picked while the server is still working", () => {
    expect(withLocalPreview(processing, local)?.url).toBe("blob:clip")
  })

  it("keeps the server's copy once there is one", () => {
    const ready = {
      ...processing,
      status: "ready" as const,
      url: "https://cdn/c.mp4",
    }
    expect(withLocalPreview(ready, local)).toBe(ready)
  })
})

describe("clipStatusLabel and progressStep", () => {
  it("counts the upload up, then says it is processing", () => {
    expect(clipStatusLabel(0.4)).toBe("Uploading 40%")
    expect(clipStatusLabel(undefined)).toBe("Processing…")
    expect(progressStep(0.33)).toBe(0.3)
    expect(progressStep(2)).toBe(1)
  })
})
