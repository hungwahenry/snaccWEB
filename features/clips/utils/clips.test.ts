import { describe, expect, it } from "vitest"
import type { SnaccClip } from "@/features/snaccs/types"
import type { ClipDraft } from "../types"
import {
  clipContentType,
  clipProblem,
  clipStatusLabel,
  isUploading,
  progressStep,
  withLocalPoster,
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
const local = { posterUrl: "blob:poster" } as ClipDraft

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

describe("withLocalPoster", () => {
  it("shows the frame you picked while the server is still working", () => {
    expect(withLocalPoster(processing, local)?.poster_url).toBe("blob:poster")
  })

  it("keeps the server's poster once there is one", () => {
    const ready = {
      ...processing,
      status: "ready" as const,
      url: "https://cdn/c.mp4",
      poster_url: "https://cdn/c.jpg",
    }
    expect(withLocalPoster(ready, local)).toBe(ready)
  })

  it("leaves the clip alone when no frame could be read", () => {
    expect(withLocalPoster(processing, { posterUrl: null } as ClipDraft)).toBe(
      processing
    )
  })
})

describe("clipStatusLabel and progressStep", () => {
  it("says uploading until the file is up, then that it is processing", () => {
    expect(clipStatusLabel(0.4)).toBe("Uploading…")
    expect(clipStatusLabel(1)).toBe("Processing…")
    expect(clipStatusLabel(undefined)).toBe("Processing…")
    expect(progressStep(0.33)).toBe(0.3)
    expect(progressStep(2)).toBe(1)
  })
})

describe("isUploading", () => {
  it("is only true for a known amount short of the whole file", () => {
    expect(isUploading(0)).toBe(true)
    expect(isUploading(0.99)).toBe(true)
    expect(isUploading(1)).toBe(false)
    expect(isUploading(null)).toBe(false)
    expect(isUploading(undefined)).toBe(false)
  })
})
