import type { Metadata } from "next"
import { ResnaccsScreen } from "@/features/snaccs/screens/resnaccs-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Resnaccs" }

type Props = { params: Promise<{ id: string }> }

export default async function ResnaccsPage({ params }: Props) {
  const { id } = await params
  await requireSession(`/resnaccs/${id}`)
  return <ResnaccsScreen id={id} />
}
