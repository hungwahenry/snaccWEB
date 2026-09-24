import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { getInviter } from "@/features/referrals/api/public"
import { JoinEntry } from "@/features/referrals/components/join-entry"
import { invitePath, joinPath } from "@/features/referrals/routes"
import { normalizeInviteCode } from "@/features/referrals/utils/invite"
import { nameOf } from "@/features/users/utils/names"
import { hasSession } from "@/lib/auth-server"

type Props = { params: Promise<{ code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = normalizeInviteCode((await params).code)
  const inviter = await getInviter(code)
  if (!inviter) return { title: "Invite not found" }

  const name = nameOf(inviter)
  const title = `${name} invited you to Snacc`
  const description = `Join Snacc with ${name}’s code ${code} and you both get paid.`

  return {
    title,
    description,
    alternates: { canonical: joinPath(code) },
    openGraph: {
      title,
      description,
      url: joinPath(code),
      images: [inviter.avatar_url],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [inviter.avatar_url],
    },
  }
}

export default async function JoinPage({ params }: Props) {
  const code = normalizeInviteCode((await params).code)
  const inviter = await getInviter(code)
  if (!inviter) notFound()
  if (await hasSession()) redirect(invitePath(code))

  return (
    <LandingShell cta="Join Snacc and get paid" next={invitePath(code)}>
      <JoinEntry inviter={inviter} code={code} />
    </LandingShell>
  )
}
