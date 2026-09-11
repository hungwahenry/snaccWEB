import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { getUserSnaccs } from "@/features/snaccs/api/public"
import { PublicSnaccCard } from "@/features/snaccs/components/public/public-snacc-card"
import { loginPath } from "@/features/auth/routes"
import { newMessagePath } from "@/features/messages/routes"
import { snaccPath } from "@/features/snaccs/routes"
import { getPublicProfile } from "@/features/users/api/public"
import { MessageCta } from "@/features/users/components/public/message-cta"
import { PublicProfileHeader } from "@/features/users/components/public/public-profile-header"
import { PublicProfileTabs } from "@/features/users/components/public/public-profile-tabs"
import { profilePath } from "@/features/users/routes"
import { ProfileScreen } from "@/features/users/screens/profile-screen"
import { nameOf } from "@/features/users/utils/names"
import { profileMeta, profileStats } from "@/features/users/utils/profile"
import { hasSession } from "@/lib/auth-server"

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) return { title: "Profile not found" }

  const name = nameOf(profile)
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
      cta={`See everything ${nameOf(profile)} posts`}
      next={profilePath(username)}
    >
      <PublicProfileHeader
        profile={profile}
        meta={profileMeta(profile)}
        stats={profileStats(profile)}
      />
      {profile.username && profile.accepts_anonymous_messages ? (
        <MessageCta
          name={nameOf(profile)}
          href={loginPath(
            newMessagePath({ id: profile.id, username: profile.username })
          )}
        />
      ) : null}
      <PublicProfileTabs />
      {snaccs.map((snacc) => (
        <PublicSnaccCard
          key={snacc.id}
          snacc={snacc}
          href={snaccPath(snacc.id)}
        />
      ))}
    </LandingShell>
  )
}
