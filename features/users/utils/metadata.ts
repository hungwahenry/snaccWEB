import type { Metadata } from "next"
import { counter, type JsonLd } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/site"
import { profilePath } from "../routes"
import type { PublicProfile } from "../types"
import { handleOf, nameOf } from "./names"

function describe(profile: PublicProfile) {
  const name = nameOf(profile, handleOf(profile) ?? "Someone")
  const campus = profile.university ? ` ${profile.university.acronym}.` : ""

  return {
    name,
    description: profile.bio?.trim() || `${name} is on Snacc.${campus}`,
  }
}

export function profileMetadata(profile: PublicProfile | null): Metadata {
  if (!profile) return { title: "Profile not found" }

  const { name, description } = describe(profile)
  const handle = handleOf(profile)
  const title = handle ? `${name} (${handle}) on Snacc` : `${name} on Snacc`
  const url = profilePath(profile.username)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: profile.is_private ? { index: false, follow: false } : undefined,
    openGraph: { title, description, url, images: [profile.avatar_url] },
    twitter: {
      card: "summary",
      title,
      description,
      images: [profile.avatar_url],
    },
  }
}

export function profileJsonLd(profile: PublicProfile): JsonLd | null {
  if (profile.is_private || !profile.username) return null

  const { name, description } = describe(profile)
  const url = absoluteUrl(profilePath(profile.username))

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: {
      "@type": "Person",
      name,
      alternateName: handleOf(profile) ?? undefined,
      identifier: profile.username,
      description,
      image: profile.avatar_url || undefined,
      url,
      affiliation: profile.university
        ? { "@type": "CollegeOrUniversity", name: profile.university.name }
        : undefined,
      interactionStatistic: [
        counter("FollowAction", profile.followers_count),
        counter("WriteAction", profile.snaccs_count),
      ],
    },
  }
}

export function profileCta(profile: PublicProfile): string {
  return `See everything ${nameOf(profile, handleOf(profile) ?? "they")} posts`
}
