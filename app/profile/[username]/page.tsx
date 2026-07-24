import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { getUserSnaccs } from "@/features/snaccs/public"
import { SnaccCard } from "@/features/snaccs/snacc-card"
import { ProfileHeader } from "@/features/users/profile-header"
import { ProfileTabs } from "@/features/users/profile-tabs"
import { getPublicProfile } from "@/features/users/public"

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) return { title: "Profile not found" }

  const name = profile.display_name ?? `@${profile.username}`
  const title = `${name} (@${profile.username}) on Snacc`
  const description =
    profile.bio?.trim() ||
    `${name} is on Snacc.${profile.university ? ` ${profile.university.acronym}.` : ""}`

  return {
    title,
    description,
    alternates: { canonical: `/@${profile.username}` },
    openGraph: {
      title,
      description,
      url: `/@${profile.username}`,
      images: [profile.avatar_url],
    },
    twitter: { card: "summary", title, description, images: [profile.avatar_url] },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) notFound()

  const snaccs = profile.username ? await getUserSnaccs(profile.username) : []

  return (
    <LandingShell cta="See all snaccs in the app">
      <ProfileHeader profile={profile} />
      <ProfileTabs />
      {snaccs.map((snacc) => (
        <SnaccCard key={snacc.id} snacc={snacc} href={`/snacc/${snacc.id}`} />
      ))}
    </LandingShell>
  )
}
