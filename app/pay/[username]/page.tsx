import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { PayEntry } from "@/features/pay/components/pay-entry"
import { getPublicProfile } from "@/features/users/api/public"

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) return { title: "Profile not found" }

  const name = profile.display_name ?? `@${profile.username}`
  const title = `Pay ${name} on Snacc`
  const description = `Send ${name} money on Snacc — instant and free.`

  return {
    title,
    description,
    alternates: { canonical: `/pay/${profile.username}` },
    openGraph: {
      title,
      description,
      url: `/pay/${profile.username}`,
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

export default async function PayPage({ params }: Props) {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile?.username) notFound()

  return (
    <LandingShell cta="Get Snacc to send and receive money">
      <PayEntry profile={profile} />
    </LandingShell>
  )
}
