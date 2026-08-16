import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { AnonSender } from "@/features/anon/anon-sender"
import { getAnonRecipient } from "@/features/anon/public"

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const recipient = await getAnonRecipient(username)
  if (!recipient) return { title: "Not found" }

  const name = recipient.display_name ?? `@${recipient.username}`
  const title = `Send ${name} an anonymous message`
  const description = `Say what you can't say out loud — ${name} will never know it's you. On Snacc.`

  return {
    title,
    description,
    alternates: { canonical: `/u/${recipient.username}` },
    openGraph: { title, description, url: `/u/${recipient.username}`, images: [recipient.avatar_url] },
    twitter: { card: "summary", title, description, images: [recipient.avatar_url] },
  }
}

export default async function AnonPage({ params }: Props) {
  const { username } = await params
  const recipient = await getAnonRecipient(username)
  if (!recipient) notFound()

  return (
    <LandingShell cta="Get Snacc to get your own anonymous inbox">
      <AnonSender recipient={recipient} />
    </LandingShell>
  )
}
