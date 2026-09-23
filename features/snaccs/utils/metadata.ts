import type { Metadata } from "next"
import { isReadyClip } from "@/features/clips/utils/viewer"
import { hangoutTitle } from "@/features/hangouts/utils/hangouts"
import { profilePath } from "@/features/users/routes"
import { handleOf, nameOf } from "@/features/users/utils/names"
import { counter, isoDuration, type JsonLd } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/site"
import { snaccPath } from "../routes"
import type { Snacc } from "../types"
import { attachmentSummary } from "./preview"

const HEADLINE_LENGTH = 110

function leadOf(snacc: Snacc): string {
  const body = snacc.body?.trim() ?? ""
  if (!snacc.hangout) return body

  const title = hangoutTitle(snacc.hangout)
  return body ? `${title} · ${body}` : title
}

function describe(snacc: Snacc) {
  const who = nameOf(snacc.author, handleOf(snacc.author) ?? "Someone")
  const lead = leadOf(snacc)
  const description =
    lead ||
    attachmentSummary({
      poll: snacc.poll !== null,
      voiceMs: snacc.voice?.duration_ms ?? null,
      sticker: snacc.sticker !== null,
      gif: snacc.gif !== null,
      images: snacc.images.length,
      clip: snacc.clip !== null,
    }) ||
    `${who} posted on Snacc.`

  return { who, title: `${who} on Snacc`, lead, description }
}

function shownClip(snacc: Snacc) {
  const clip = snacc.clip
  return !snacc.spoiler && clip && isReadyClip(clip) ? clip : null
}

export function snaccPictures(snacc: Snacc): string[] {
  if (snacc.spoiler) return []

  const poster = shownClip(snacc)?.poster_url
  return [
    ...snacc.images.map((image) => image.url),
    ...(snacc.gif ? [snacc.gif.url] : []),
    ...(poster ? [poster] : []),
  ]
}

export function snaccMetadata(snacc: Snacc | null): Metadata {
  if (!snacc) return { title: "Snacc not found" }

  const { title, description } = describe(snacc)
  const media = snaccPictures(snacc)[0]
  const avatar = snacc.author.avatar_url || undefined
  const image = media ?? avatar
  const url = snaccPath(snacc.id)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: media ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export function snaccJsonLd(snacc: Snacc): JsonLd {
  const { who, title, lead, description } = describe(snacc)
  const clip = shownClip(snacc)
  const pictures = snaccPictures(snacc)
  const body = snacc.body?.trim()
  const username = snacc.author.username

  return {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    url: absoluteUrl(snaccPath(snacc.id)),
    datePublished: snacc.created_at,
    headline: (lead || title).slice(0, HEADLINE_LENGTH),
    articleBody: body || undefined,
    author: {
      "@type": "Person",
      name: who,
      alternateName: handleOf(snacc.author) ?? undefined,
      url: username ? absoluteUrl(profilePath(username)) : undefined,
      image: snacc.author.avatar_url || undefined,
    },
    image: pictures.length > 0 ? pictures : undefined,
    video:
      clip?.poster_url && clip.hls_url
        ? {
            "@type": "VideoObject",
            name: title,
            description,
            thumbnailUrl: clip.poster_url,
            contentUrl: clip.hls_url,
            uploadDate: snacc.created_at,
            duration: isoDuration(clip.duration_ms),
          }
        : undefined,
    interactionStatistic: [
      counter("LikeAction", snacc.reactions_count),
      counter("CommentAction", snacc.comments_count),
      counter("ShareAction", snacc.resnaccs_count),
    ],
  }
}
