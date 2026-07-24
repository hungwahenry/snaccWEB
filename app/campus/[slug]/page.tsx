import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { getCampusSnaccs } from "@/features/snaccs/public"
import { SnaccCard } from "@/features/snaccs/snacc-card"
import { CampusHeader } from "@/features/universities/campus-header"
import { getPublicCampus } from "@/features/universities/public"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const campus = await getPublicCampus(slug)
  if (!campus) return { title: "Campus not found" }

  const title = `${campus.name} on Snacc`
  const description = campus.motto
    ? `${campus.motto} — ${campus.members_count.toLocaleString()} students on Snacc.`
    : `See what ${campus.acronym} is talking about on Snacc.`
  const image = campus.logo_url ?? undefined

  return {
    title,
    description,
    alternates: { canonical: `/campus/${campus.slug}` },
    openGraph: {
      title,
      description,
      url: `/campus/${campus.slug}`,
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary", title, description, images: image ? [image] : undefined },
  }
}

export default async function CampusPage({ params }: Props) {
  const { slug } = await params
  const campus = await getPublicCampus(slug)
  if (!campus) notFound()

  const snaccs = await getCampusSnaccs(campus.slug)

  return (
    <LandingShell cta="See all snaccs in the app">
      <CampusHeader campus={campus} />
      {snaccs.map((snacc) => (
        <SnaccCard key={snacc.id} snacc={snacc} href={`/snacc/${snacc.id}`} />
      ))}
    </LandingShell>
  )
}
