import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingShell } from "@/components/marketing/landing-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { getPublicSnacc } from "@/features/snaccs/api/public"
import { PublicSnaccCard } from "@/features/snaccs/components/public/public-snacc-card"
import { SnaccDetailScreen } from "@/features/snaccs/screens/snacc-detail-screen"
import { snaccJsonLd, snaccMetadata } from "@/features/snaccs/utils/metadata"
import { hasSession } from "@/lib/auth-server"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return snaccMetadata(await getPublicSnacc(id))
}

export default async function SnaccPage({ params }: Props) {
  const { id } = await params

  if (await hasSession()) return <SnaccDetailScreen id={id} />

  const snacc = await getPublicSnacc(id)
  if (!snacc) notFound()

  return (
    <LandingShell cta="Join the conversation" next={`/snacc/${id}`}>
      <JsonLd data={snaccJsonLd(snacc)} />
      <PublicSnaccCard snacc={snacc} />
    </LandingShell>
  )
}
