import type { Metadata } from "next"
import { countLabel } from "@/lib/format"
import { campusPath } from "../routes"
import type { UniversityDetail } from "../types"

export const CAMPUS_CTA = "See what your campus is saying"

export function campusMetadata(campus: UniversityDetail | null): Metadata {
  if (!campus) return { title: "Campus not found" }

  const title = `${campus.name} on Snacc`
  const description = campus.motto
    ? `${campus.motto} — ${countLabel(campus.members_count, "student")} on Snacc.`
    : `See what ${campus.acronym} is talking about on Snacc.`
  const images = campus.logo_url ? [campus.logo_url] : undefined
  const url = campusPath(campus.slug)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images },
    twitter: { card: "summary", title, description, images },
  }
}
