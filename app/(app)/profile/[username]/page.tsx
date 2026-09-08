import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { getUserSnaccs } from "@/features/snaccs/api/public"
import { PublicSnaccCard } from "@/features/snaccs/components/public/public-snacc-card"
import { getPublicProfile } from "@/features/users/api/public"
import { MessageCta } from "@/features/users/components/public/message-cta"
import { PublicProfileHeader } from "@/features/users/components/public/public-profile-header"
import { PublicProfileTabs } from "@/features/users/components/public/public-profile-tabs"
import { ProfileScreen } from "@/features/users/screens/profile-screen"
import { hasSession } from "@/lib/auth-server"

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
    twitter: {
      card: "summary",
      title,
      description,
      images: [profile.avatar_url],
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params

  if (await hasSession()) return <ProfileScreen username={username} />

  const profile = await getPublicProfile(username)
  if (!profile) notFound()

  const snaccs = profile.username ? await getUserSnaccs(profile.username) : []

  return (
    <LandingShell
      cta={`See everything ${profile.display_name ?? `@${profile.username}`} posts`}
      next={`/profile/${username}`}
    >
      <PublicProfileHeader profile={profile} />
      {profile.username ? (
        <MessageCta
          id={profile.id}
          username={profile.username}
          name={profile.display_name ?? `@${profile.username}`}
          accepting={profile.accepts_anonymous_messages}
        />
      ) : null}
      <PublicProfileTabs />
      {snaccs.map((snacc) => (
        <PublicSnaccCard
          key={snacc.id}
          snacc={snacc}
          href={`/snacc/${snacc.id}`}
        />
      ))}
    </LandingShell>
  )
}
