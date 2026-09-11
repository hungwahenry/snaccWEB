import { shareLink } from "@/lib/share-links"
import type { ShareSubject } from "../types"
import { snaccShareText } from "@/features/snaccs/utils/share"

export function shareable(subject: ShareSubject): boolean {
  return subject.kind !== "profile" || Boolean(subject.profile.username)
}

export function linkFor(subject: ShareSubject): string {
  if (subject.kind === "snacc") return shareLink.snacc(subject.snacc.id)
  if (subject.kind === "campus")
    return shareLink.campus(subject.university.slug)
  return shareLink.profile(subject.profile.username ?? "")
}

export function labelFor(subject: ShareSubject): string {
  if (subject.kind === "snacc") return "snacc"
  if (subject.kind === "campus") return "campus"
  return "profile"
}

export function textFor(subject: ShareSubject): string {
  if (subject.kind === "snacc") {
    return snaccShareText(subject.snacc)
  }
  if (subject.kind === "campus") return `${subject.university.name} on Snacc 👀`
  return `Check out @${subject.profile.username} on Snacc 👀`
}
