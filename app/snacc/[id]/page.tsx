import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { getPublicSnacc } from "@/features/snaccs/public"
import { SnaccCard } from "@/features/snaccs/snacc-card"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const snacc = await getPublicSnacc(id)
  if (!snacc) return { title: "Snacc not found" }

  const who = snacc.anonymous
    ? "Ghost"
    : (snacc.author.display_name ?? `@${snacc.author.username}`)
  const title = `${who} on Snacc`
  const description = snacc.body?.trim() || `${who} posted on Snacc.`
  const hasMedia = snacc.images.length > 0 || snacc.gif !== null
  const image =
    snacc.images[0]?.url ?? snacc.gif?.url ?? (snacc.anonymous ? undefined : snacc.author.avatar_url)

  return {
    title,
    description,
    alternates: { canonical: `/snacc/${snacc.id}` },
    openGraph: {
      title,
      description,
      url: `/snacc/${snacc.id}`,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: hasMedia ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function SnaccPage({ params }: Props) {
  const { id } = await params
  const snacc = await getPublicSnacc(id)
  if (!snacc) notFound()

  return (
    <LandingShell cta="See the comments in the app">
      <SnaccCard snacc={snacc} />
    </LandingShell>
  )
}
