import { describe, expect, it } from "vitest"
import type { Snacc } from "../types"
import { snaccJsonLd, snaccMetadata, snaccPictures } from "./metadata"

const post = (over: Partial<Snacc> = {}) =>
  ({
    id: "01SNACC",
    body: "First day back on campus",
    created_at: "2026-09-19T10:00:00.000Z",
    anonymous: false,
    spoiler: false,
    author: {
      username: "ada",
      display_name: "Ada",
      avatar_url: "https://cdn/ada.png",
    },
    images: [],
    gif: null,
    sticker: null,
    voice: null,
    poll: null,
    clip: null,
    reactions_count: 4,
    comments_count: 2,
    resnaccs_count: 1,
    ...over,
  }) as unknown as Snacc

const photo = { url: "https://cdn/photo.jpg" }
const clip = {
  id: "c1",
  status: "ready",
  hls_url: "https://stream/c1/video.m3u8",
  poster_url: "https://cdn/c1.jpg",
  poster_thumb_url: "https://cdn/c1-thumb.jpg",
  width: 720,
  height: 1280,
  duration_ms: 12_400,
}

describe("snaccMetadata", () => {
  it("says so when there is no such snacc", () => {
    expect(snaccMetadata(null)).toEqual({ title: "Snacc not found" })
  })

  it("titles the page by who posted, and points at the snacc itself", () => {
    const metadata = snaccMetadata(post())
    expect(metadata.title).toEqual({ absolute: "Ada on Snacc" })
    expect(metadata.description).toBe("First day back on campus")
    expect(metadata.alternates?.canonical).toBe("/snacc/01SNACC")
  })

  it("previews with the photo, and falls back to the face", () => {
    expect(
      snaccMetadata(post({ images: [photo] } as Partial<Snacc>)).openGraph
        ?.images
    ).toEqual(["https://cdn/photo.jpg"])
    expect(snaccMetadata(post()).openGraph?.images).toEqual([
      "https://cdn/ada.png",
    ])
  })

  it("previews a clip with its cover, and says it is a clip when there are no words", () => {
    const metadata = snaccMetadata(post({ body: null, clip } as Partial<Snacc>))
    expect(metadata.openGraph?.images).toEqual(["https://cdn/c1.jpg"])
    expect(metadata.description).toBe("🎬 Clip")
  })

  it("leads a hangout with its title, then its note", () => {
    const hangout = { emoji: "⚽", title: "watch the derby" }
    expect(
      snaccMetadata(post({ body: null, hangout } as Partial<Snacc>)).description
    ).toBe("⚽ watch the derby")
    expect(
      snaccMetadata(post({ body: "bring snacks", hangout } as Partial<Snacc>))
        .description
    ).toBe("⚽ watch the derby · bring snacks")
  })

  it("never puts sensitive media in a link preview", () => {
    const metadata = snaccMetadata(
      post({ spoiler: true, images: [photo], clip } as Partial<Snacc>)
    )
    expect(metadata.openGraph?.images).toEqual(["https://cdn/ada.png"])
  })

  it("keeps a ghost's face and name out of it", () => {
    const metadata = snaccMetadata(post({ anonymous: true }))
    expect(metadata.title).toEqual({ absolute: "Ghost on Snacc" })
    expect(metadata.openGraph?.images).toBeUndefined()
  })
})

describe("snaccPictures", () => {
  it("leaves out the cover of a clip that cannot play yet", () => {
    expect(
      snaccPictures(
        post({ clip: { ...clip, status: "processing" } } as Partial<Snacc>)
      )
    ).toEqual([])
  })
})

describe("snaccJsonLd", () => {
  it("describes the post, who wrote it and how it is doing", () => {
    const data = snaccJsonLd(post())

    expect(data).toMatchObject({
      "@type": "SocialMediaPosting",
      url: "https://snacc.fyi/snacc/01SNACC",
      datePublished: "2026-09-19T10:00:00.000Z",
      headline: "First day back on campus",
      author: {
        name: "Ada",
        alternateName: "@ada",
        url: "https://snacc.fyi/@ada",
      },
    })
    expect(data.interactionStatistic).toHaveLength(3)
    expect(data.video).toBeUndefined()
  })

  it("describes a clip as a video with its cover and length", () => {
    expect(snaccJsonLd(post({ clip } as Partial<Snacc>)).video).toMatchObject({
      "@type": "VideoObject",
      thumbnailUrl: "https://cdn/c1.jpg",
      contentUrl: "https://stream/c1/video.m3u8",
      duration: "PT12S",
    })
  })

  it("says nothing about who a ghost is, and shows nothing sensitive", () => {
    const data = snaccJsonLd(
      post({
        anonymous: true,
        spoiler: true,
        images: [photo],
        clip,
      } as Partial<Snacc>)
    )

    expect(data.author).toEqual({ "@type": "Person", name: "Ghost" })
    expect(data.image).toBeUndefined()
    expect(data.video).toBeUndefined()
  })
})
