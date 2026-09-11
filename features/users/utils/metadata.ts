import type { Metadata } from "next"
import { profilePath } from "../routes"
import type { PublicProfile } from "../types"
import { handleOf, nameOf } from "./names"

export function profileMetadata(profile: PublicProfile | null): Metadata {
  if (!profile) return { title: "Profile not found" }

  const name = nameOf(profile, handleOf(profile) ?? "Someone")
  const handle = handleOf(profile)
  const title = handle ? `${name} (${handle}) on Snacc` : `${name} on Snacc`
  const campus = profile.university ? ` ${profile.university.acronym}.` : ""
  const description = profile.bio?.trim() || `${name} is on Snacc.${campus}`
  const url = profilePath(profile.username)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [profile.avatar_url] },
    twitter: {
      card: "summary",
      title,
      description,
      images: [profile.avatar_url],
    },
  }
}

/** The sign-up prompt under someone's public profile. */
export function profileCta(profile: PublicProfile): string {
  return `See everything ${nameOf(profile, handleOf(profile) ?? "they")} posts`
}
