import type { PublicProfile } from "../types"
import { handleOf, nameOf } from "./names"

type ClassFields = Pick<PublicProfile, "graduated" | "graduation_year">

export function classOf(profile: ClassFields): string | null {
  if (!profile.graduated) return null
  return profile.graduation_year
    ? `🎓 Class of ${profile.graduation_year}`
    : "🎓 Alumni"
}

/** The line under someone's name: campus, class and major, whichever they have. */
export function profileMeta(
  profile: ClassFields & Pick<PublicProfile, "university" | "major">
): string | null {
  const parts = [profile.university?.acronym, classOf(profile), profile.major]
  const present = parts.filter((part): part is string => Boolean(part))
  return present.length > 0 ? present.join(" · ") : null
}

export function followLabel(
  person: Pick<PublicProfile, "is_following" | "follows_you">
): string {
  if (person.is_following) return "Following"
  return person.follows_you ? "Follow back" : "Follow"
}

export function notifyLabel(notifying: boolean): string {
  return notifying
    ? "Stop notifying me of their posts"
    : "Notify me when they post"
}

/** What the picture does when pressed, said out loud for a screen reader. */
export function avatarLabel(
  person: Pick<PublicProfile, "display_name" | "username">,
  hasMoments: boolean
): string {
  const name = nameOf(person)
  return hasMoments ? `${name}’s moments` : `${name}’s profile photo`
}

export interface ProfileStat {
  label: string
  count: number
  href?: string
}

export function profileStats(
  profile: Pick<
    PublicProfile,
    | "snaccs_count"
    | "total_views_received"
    | "following_count"
    | "followers_count"
  >,
  hrefs: { following?: string; followers?: string } = {}
): ProfileStat[] {
  return [
    { label: "Snaccs", count: profile.snaccs_count },
    { label: "Views", count: profile.total_views_received },
    {
      label: "Following",
      count: profile.following_count,
      href: hrefs.following,
    },
    {
      label: "Followers",
      count: profile.followers_count,
      href: hrefs.followers,
    },
  ]
}

/** "@ada · UNILAG", or whichever half there is. */
export function handleWithCampus(person: {
  username: string | null
  university: { acronym: string } | null
}): string {
  return [handleOf(person), person.university?.acronym]
    .filter((part): part is string => Boolean(part))
    .join(" · ")
}
