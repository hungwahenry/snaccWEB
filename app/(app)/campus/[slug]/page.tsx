import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicCampus } from "@/features/campus/api/public"
import { PublicCampus } from "@/features/campus/components/public-campus"
import { CampusScreen } from "@/features/campus/screens/campus-screen"
import { campusMetadata } from "@/features/campus/utils/metadata"
import { getCampusSnaccs } from "@/features/snaccs/api/public"
import { hasSession } from "@/lib/auth-server"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return campusMetadata(await getPublicCampus(slug))
}

export default async function CampusPage({ params }: Props) {
  const { slug } = await params

  if (await hasSession()) return <CampusScreen slug={slug} />

  const campus = await getPublicCampus(slug)
  if (!campus) notFound()

  return (
    <PublicCampus campus={campus} snaccs={await getCampusSnaccs(campus.slug)} />
  )
}
