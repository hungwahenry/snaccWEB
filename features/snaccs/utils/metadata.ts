import type { Metadata } from "next"
import { authorNameOf, handleOf } from "@/features/users/utils/names"
import { snaccPath } from "../routes"
import type { Snacc } from "../types"
import { attachmentSummary } from "./preview"

export function snaccMetadata(snacc: Snacc | null): Metadata {
  if (!snacc) return { title: "Snacc not found" }

  const who = authorNameOf(
    snacc.author,
    snacc.anonymous,
    handleOf(snacc.author) ?? "Someone"
  )
  const title = `${who} on Snacc`
  const description =
    snacc.body?.trim() ||
    attachmentSummary({
      poll: snacc.poll !== null,
      voiceMs: snacc.voice?.duration_ms ?? null,
      sticker: snacc.sticker !== null,
      gif: snacc.gif !== null,
      images: snacc.images.length,
    }) ||
    `${who} posted on Snacc.`
  const media = snacc.spoiler
    ? undefined
    : (snacc.images[0]?.url ?? snacc.gif?.url)
  const avatar = snacc.anonymous
    ? undefined
    : snacc.author.avatar_url || undefined
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
