import { shareLink } from "@/lib/share-links"
import type { ShareSubject } from "../types"

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
    const who = subject.snacc.anonymous
      ? null
      : (subject.snacc.author.display_name ??
        (subject.snacc.author.username
          ? `@${subject.snacc.author.username}`
          : null))
    return who ? `${who} on Snacc 👀` : "Check out this snacc on Snacc 👀"
  }
  if (subject.kind === "campus") return `${subject.university.name} on Snacc 👀`
  return `Check out @${subject.profile.username} on Snacc 👀`
}
